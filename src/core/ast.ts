/* tslint:disable:no-use-before-declare */
namespace pudu.ast {

    import Token = chevrotain.Token

    export class AstNode {

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
            let descendantsArrs = _.map(<any>this.children, (currChild:AstNode) => currChild.descendants())
            return <any>_.flatten(descendantsArrs)
        }

        children():AstNode[] {
            return <any>_.pick(this, (val) => {
                return val instanceof AstNode &&
                    !val === NIL &&
                    val.parent() === this
            })
        }
    }


    export class AstNodesArray<T extends AstNode> extends AstNode {
        constructor(subNodes:T[], _parent:AstNode = NIL) {
            super(_parent)
            // TODO: verify is safe?  {} <- []
            this.children = <any>_.clone(subNodes)
        }
    }


    export class Nil extends AstNode {

        protected initialized = false

        constructor() {
            super(null)
            // TODO: class expression as a singleton in TSC 1.6?
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
