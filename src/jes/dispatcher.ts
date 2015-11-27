namespace jes.ast.dispatcher {

    import BaseBySuperTypeDispatcher = pudu.ast.dispatcher.BaseBySuperTypeDispatcher
    import findHandleMethodsOnDispatcher = pudu.ast.dispatcher.findHandleMethodsOnDispatcher
    import validateBaseDispatcher = pudu.ast.dispatcher.validateBaseDispatcher
    import findClassNamesThatNeedDispatcherImpel = pudu.ast.dispatcher.findClassNamesThatNeedDispatcherImpel
    import IAstPatternDispatcher = pudu.ast.dispatcher.IAstPatternDispatcher
    import AstNode = pudu.ast.AstNode

    export class BaseJsonDispatcher<IN, OUT> extends BaseBySuperTypeDispatcher<IN, OUT> {

        private static performedBaseValidations = false

        constructor() {
            super()
            if (!BaseJsonDispatcher.performedBaseValidations) {
                BaseJsonDispatcher.performedBaseValidations = true
                // don't worry the static flag prevents infinite recursion
                let baseDispatcher = new BaseJsonDispatcher()
                let actualHandlerMethods = findHandleMethodsOnDispatcher(baseDispatcher)
                let classesThatNeedHandlers = this.getSupportedClassNames()
                validateBaseDispatcher(classesThatNeedHandlers, actualHandlerMethods)
            }
        }

        getSupportedClassNames():string[] {
            return findClassNamesThatNeedDispatcherImpel(jes.ast)
        }

        getBaseDispatcherInstance():IAstPatternDispatcher<IN, OUT> {
            return new BaseJsonDispatcher<IN, OUT>()
        }

        handleObjectNode(node:ObjectNode, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleObjectItemNode(node:ObjectItemNode, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleArrayNode(node:ArrayNode, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleStringNode(node:StringNode, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleNumberNode(node:NumberNode, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTrueNode(node:TrueNode, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleFalseNode(node:FalseNode, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleNullNode(node:NullNode, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }
    }

    /**
     * convenience class to be used in situations where the same action needs to be invoked on all the nodes
     * alternatively just use a map/forEach... :)
     */
    export abstract class SameActionDispatcher<IN, OUT> extends BaseJsonDispatcher<IN, OUT> {

        constructor(private action:(node:AstNode) => OUT) {super()}

        handleAstNode(node:AstNode):OUT {
            return this.action(node)
        }
    }
}
