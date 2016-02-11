import {ParseTree} from "./parse_tree"
import {AstNode, AstNodesArray, Nil} from "./ast"
import * as utils from "./utils"
import {Token} from "chevrotain"
import * as _ from "lodash"

export interface IMatchCase {
    CASE:Function, // a Token Constructor
    THEN:Function  // The Action to perform
}

export function MATCH_CHILDREN(root:ParseTree, ...cases:IMatchCase[]):void {

    _.forEach(root.children, (currChild) => {
        let matchingCase = _.find(cases,
            (currCase) => currChild.payload instanceof currCase.CASE)

        if (_.isUndefined(matchingCase)) {
            let childClassName = utils.getClassNameFromInstance(currChild)
            throw Error(`non exhaustive match, no case for <${childClassName}>`)
        }
        matchingCase.THEN.call(null, currChild)
    })
}

export function setParent(node:AstNode):void {

    let kids:AstNode[]
    if (node instanceof AstNodesArray) {
        // we can invoke children() directly because it's implmentation does not rely on the parent property
        // already being set.
        kids = node.children()
    }
    else { // not an AstNodesArray
        kids = _.filter<AstNode>(<any>node, (prop, name:string) => {
            return prop instanceof AstNode
                && !(prop instanceof Nil) &&
                name !== "_parent"
        })
    }

    _.forEach(kids, (currChild) => {
        (<any>currChild)._parent = node
    })
}

export function buildSyntaxBox(tree:ParseTree):Token[] {
    return _.map(tree.children, (subtree) => subtree.payload)
}
