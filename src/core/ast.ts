namespace pudu.ast {

    import Token = chevrotain.Token

    export class AstNode {

        constructor(private _parent:AstNode = NIL) {}

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
            let descendantsArrs = _.map(this.children, currChild => currChild.descendants())
            return _.flatten(descendantsArrs)
        }

        children():AstNode[] {
            return _.pick(this, (val, key) => {
                return val instanceof AstNode &&
                    !val === NIL &&
                    val.parent() === this
            })
        }
    }


    export class AstNodesArray<T extends AstNode> extends AstNode {
        constructor(subNodes:T[], private _parent:AstNode = NIL) {
            super(_parent)
            // TODO: verify is safe?  {} <- []
            this.children = <any>_.clone(subNodes)
        }
    }


    export class Nil extends AstNode {

        private initialized = false

        constructor() {
            // TODO: class expression as a singleton in TSC 1.6?
            if (this.initialized) {
                throw Error("Nil Node can only be initialized once")
            }
            this.initialized = true
            super(this)
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
