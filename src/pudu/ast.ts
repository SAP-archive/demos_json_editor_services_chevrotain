/* tslint:disable:no-use-before-declare */

import * as _ from "lodash"
import {Token} from "chevrotain"
import {IAstPatternDispatcher} from "./dispatcher"

export interface ITextPosition {
    startOffset: number
    startLine: number
    startColumn: number
    endOffset: number
    endLine: number
    endColumn: number
}

export const NO_POSITION:ITextPosition = {
    startOffset: -1,
    startLine:   -1,
    startColumn: -1,
    endOffset:   -1,
    endLine:     -1,
    endColumn:   -1
}

// all your state is belong to us.
Object.freeze(NO_POSITION)

export abstract class AstNode {

    constructor(protected _parent:AstNode = NIL,
                protected _syntaxBox:Token[] = []) {}

    parent():AstNode {
        return this._parent
    }

    ancestors():AstNode[] {
        let ancestors = []
        let currAncestor = this._parent
        while (currAncestor !== NIL) {
            ancestors.push(currAncestor)
        }
        return ancestors
    }

    descendants():AstNode[] {
        let directChildren = this.children()
        let descendantsArrs = _.map(directChildren, (currChild:AstNode) => {
            return currChild.descendants()
        })
        return <any>directChildren.concat(_.flatten(descendantsArrs))
    }

    children():AstNode[] {
        let kids = <any>_.filter(<any>this, (prop) => {
            return prop instanceof AstNode &&
                prop !== NIL &&
                prop.parent() === this
        })
        return kids
    }

    /**
     * Visitor implementation.
     * will invoke the provided dispatcher for each descendant in the AST
     * @param dispatcher
     * @returns {T[]}
     */
    visit<T>(dispatcher:IAstPatternDispatcher<void, T>):T[] {
        let myselfAndDescendants = [<any>this].concat(this.descendants())
        return _.map(myselfAndDescendants, (currNode) => {
            return dispatcher.dispatch(currNode)
        })
    }

    position():ITextPosition {
        let meAndDescendantsNodes = this.descendants().concat([this])
        let allTokens = _.flatten(_.map(meAndDescendantsNodes, (currChild) => currChild.syntaxBox))
        let allActualTokens = _.reject(allTokens, (currToken) => currToken.isInsertedInRecovery)

        if (_.isEmpty(allActualTokens)) {
            return NO_POSITION
        }

        let position = _.reduce<Token, ITextPosition>(<any>allActualTokens, (resultPosition:ITextPosition, currToken) => {
            if (currToken.offset < resultPosition.startOffset) {
                resultPosition.startOffset = currToken.offset
            }

            if (currToken.startLine < resultPosition.startLine) {
                resultPosition.startLine = currToken.startLine
            }

            if (currToken.startColumn < resultPosition.startColumn) {
                resultPosition.startColumn = currToken.startColumn
            }

            let currEndOffset = currToken.offset + currToken.image.length
            if (currEndOffset > resultPosition.endOffset) {
                resultPosition.endOffset = currEndOffset
            }

            if (currToken.endLine > resultPosition.endLine) {
                resultPosition.endLine = currToken.endLine
            }

            if (currToken.endColumn > resultPosition.endColumn) {
                resultPosition.endColumn = currToken.endColumn
            }

            return resultPosition
        }, {
            startOffset: Infinity,
            startLine:   Infinity,
            startColumn: Infinity,
            endOffset:   -Infinity,
            endLine:     -Infinity,
            endColumn:   -Infinity
        })

        return position
    }
    get syntaxBox():Token[] {
        // TODO: this is mutable, perhaps freeze it in the constructor?
        return this._syntaxBox
    }
}

// TODO: AstNodesArray? or support array properties in children() on AstNode?
// TODO: Maybe we don't need AstNodesArray at all? it seems to just complicates things...
export class AstNodesArray<T extends AstNode> extends AstNode {
    protected _children:T[]

    constructor(subNodes:T[],
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        // TODO: is clone needed? ? it is not even deep clone
        // TODO: verify is safe?  {} <- .
        // TODO: maybe just freeze it?
        this._children = <any>_.clone(subNodes)
    }

    children():AstNode[] {
        return this._children
    }
}

export class Nil extends AstNode {

    protected initialized = false

    constructor() {
        super(null)
        if (this.initialized) {
            throw Error("Nil Node can only be initialized once")
        }
        this.initialized = true
        this._parent = null
    }

    ancestors():AstNode[] {
        return []
    }

    descendants():AstNode[] {
        return []
    }
}


export const NIL:any = new Nil()
