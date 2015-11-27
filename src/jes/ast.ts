namespace jes.ast {

    import AstNode = pudu.ast.AstNode
    import AstNodesArray = pudu.ast.AstNodesArray
    import NIL = pudu.ast.NIL

    export type ValueNode = StringNode | NumberNode | TrueNode | FalseNode |
        NullNode | ArrayNode | ObjectNode | pudu.ast.Nil

    export class ObjectNode extends AstNodesArray <ObjectItemNode> {

        get size():number {
            return this._children.length
        }
    }

    export class ObjectItemNode extends AstNode {

        constructor(private _key:StringNode,
                    private _value:ValueNode = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get key():StringNode {
            return this._key
        }

        get value():ValueNode {
            return this._value
        }
    }

    export class ArrayNode extends AstNodesArray<ValueNode> {

        get length():number {
            return this._children.length
        }
    }

    export class StringNode extends AstNode {
        constructor(private _value:string,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get value():string {
            return this._value;
        }
    }

    export class NumberNode extends AstNode {
        constructor(private _value:number,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get value():number {
            return this._value;
        }
    }

    export class TrueNode extends AstNode {}

    export class FalseNode extends AstNode {}

    export class NullNode extends AstNode {}
}
