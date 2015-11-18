namespace dts.ast.dispatcher {

    import BaseBySuperTypeDispatcher = pudu.ast.dispatcher.BaseBySuperTypeDispatcher
    import findHandleMethodsOnDispatcher = pudu.ast.dispatcher.findHandleMethodsOnDispatcher
    import validateBaseDispatcher = pudu.ast.dispatcher.validateBaseDispatcher
    import findClassNamesThatNeedDispatcherImpel = pudu.ast.dispatcher.findClassNamesThatNeedDispatcherImpel
    import IAstPatternDispatcher = pudu.ast.dispatcher.IAstPatternDispatcher
    import AstNode = pudu.ast.AstNode

    export class BaseDTSDispatcher<IN, OUT> extends BaseBySuperTypeDispatcher<IN, OUT> {

        private static performedBaseValidations = false

        constructor() {
            super()
            if (!BaseDTSDispatcher.performedBaseValidations) {
                BaseDTSDispatcher.performedBaseValidations = true
                // don't worry the static flag prevents infinite recursion
                let baseDispatcher = new BaseDTSDispatcher()
                let actualHandlerMethods = findHandleMethodsOnDispatcher(baseDispatcher)
                let classesThatNeedHandlers = this.getSupportedClassNames()
                validateBaseDispatcher(classesThatNeedHandlers, actualHandlerMethods)
            }
        }

        getSupportedClassNames():string[] {
            return findClassNamesThatNeedDispatcherImpel(dts.ast)
        }

        getBaseDispatcherInstance():IAstPatternDispatcher<IN, OUT> {
            return new BaseDTSDispatcher<IN, OUT>()
        }

        handleIdentifier(node:Identifier, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleDeclarationSourceFile(node:DeclarationSourceFile, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleDeclarationElements(node:DeclarationElements, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleQualifiedName(node:QualifiedName, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTypeParameters(node:TypeParameters, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTypeParameter(node:TypeParameter, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleConstraint(node:Constraint, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleType(node:Type, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleUnionType(node:UnionType, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handlePrimaryType(node:PrimaryType, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handlePredefinedType(node:PredefinedType, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTypeReference(node:TypeReference, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleObjectType(node:ObjectType, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTupleType(node:TupleType, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTypeQuery(node:TypeQuery, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTypeBody(node:TypeBody, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTypeMember(node:TypeMember, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handlePropertySignature(node:PropertySignature, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleMethodSignature(node:MethodSignature, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handlePropertyName(node:PropertyName, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleCallSignature(node:CallSignature, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleParameterList(node:ParameterList, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleParameter(node:Parameter, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleRequiredOrOptionalParameter(node:RequiredOrOptionalParameter, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleRestParameter(node:RestParameter, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleConstructSignature(node:ConstructSignature, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAccessibilityModifier(node:AccessibilityModifier, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handlePublicModifier(node:PublicModifier, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handlePrivateModifier(node:PrivateModifier, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleProtectedModifier(node:ProtectedModifier, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleIndexSignature(node:IndexSignature, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleFunctionType(node:FunctionType, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleConstructorType(node:ConstructorType, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTypeArguments(node:TypeArguments, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleDeclarationElement(node:DeclarationElement, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTypeAliasDeclaration(node:TypeAliasDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleTypeAnnotation(node:TypeAnnotation, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleInterfaceDeclaration(node:InterfaceDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleInterfaceExtendsClause(node:InterfaceExtendsClause, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleClassOrInterfaceTypeList(node:ClassOrInterfaceTypeList, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleClassHeritage(node:ClassHeritage, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleClassExtendsClause(node:ClassExtendsClause, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleImplementsClause(node:ImplementsClause, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientDeclaration(node:AmbientDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientEnumDeclaration(node:AmbientEnumDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleEnumBody(node:EnumBody, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleEnumMember(node:EnumMember, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleImportDeclaration(node:ImportDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleExternalImportDeclaration(node:ExternalImportDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleExternalModuleReference(node:ExternalModuleReference, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleExportAssignment(node:ExportAssignment, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientVariableDeclaration(node:AmbientVariableDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientFunctionDeclaration(node:AmbientFunctionDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientClassDeclaration(node:AmbientClassDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientClassBody(node:AmbientClassBody, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientClassBodyElement(node:AmbientClassBodyElement, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientConstructorDeclaration(node:AmbientConstructorDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientPropertyMemberDeclaration(node:AmbientPropertyMemberDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handlePropertyMemberDeclarationWithCallSignature(node:PropertyMemberDeclarationWithCallSignature, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handlePropertyMemberDeclarationWithTypeAnnotation(node:PropertyMemberDeclarationWithTypeAnnotation, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleIndexSignatureInAmbientClassBody(node:IndexSignatureInAmbientClassBody, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientModuleDeclaration(node:AmbientModuleDeclaration, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientModuleBody(node:AmbientModuleBody, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }

        handleAmbientModuleElement(node:AmbientModuleElement, param?:IN, currClass?):OUT {
            return this.dispatchAsSuperClass(node, param, currClass)
        }
    }

    /**
     * convenience class to be used in situations where the same action needs to be invoked on all the nodes
     * alternatively just use a map/forEach... :)
     */
    export abstract class SameActionDispatcher<IN, OUT> extends BaseDTSDispatcher<IN, OUT> {

        constructor(private action:(node:AstNode) => OUT) {super()}

        handleAstNode(node:AstNode):OUT {
            return this.action(node)
        }
    }
}
