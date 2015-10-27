/* tslint:disable:no-use-before-declare */
namespace jes.core.ast {

    import Token = chevrotain.Token
    import BaseStrategy = jes.core.ast.dispatcher.BaseBySuperTypeDispatcher;


    export abstract class AstNode {

        constructor(protected _parent:AstNode = NIL) {}

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
                return prop instanceof AstNode && !(prop === NIL || prop.parent() === this)
            })

            return kids
        }

        /**
         * Visitor implementation.
         * will invoke the provided dispatcher for each descendant in the AST
         * @param dispatcher
         * @returns {T[]}
         */
        visit<T>(dispatcher:dispatcher.IAstPatternDispatcher<void, T>):T[] {
            let myselfAndDescendants = [this].concat(this.descendants())
            return _.map(myselfAndDescendants, (currNode) => {
                return dispatcher.dispatch(currNode)
            })
        }
    }

    export class AstNodesArray<T extends AstNode> extends AstNode {
        protected _children:T[]

        constructor(subNodes:T[], _parent:AstNode = NIL) {
            super(_parent)
            // TODO: verify is safe?  {} <- []
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
}
