namespace jes.ast {

    import AstNode = pudu.ast.AstNode
    import AstNodesArray = pudu.ast.AstNodesArray
    import NIL = pudu.ast.NIL


    export class DeclarationSourceFile extends AstNode {

        constructor(private _declarationElements:DeclarationElements) {}

        get declarationElements():DeclarationElements {
            return this._declarationElements
        }

        // TODO: is an empty immutable setter required too?
    }

    // TODO: fqn():string method?
    export class QualifiedName extends AstNodesArray<Identifier> {}

    export class DeclarationElements extends AstNodesArray<TypeParameter> {}

    export class TypeParameter extends AstNode {
        constructor(private _identifier:Identifier,
                    private _constraint:Constraint = NIL) {}

        get identifier():Identifier {
            return this._identifier
        }

        get constraint():Constraint {
            return this._constraint
        }
    }

    export class Constraint extends AstNode {
        constructor(private _type:Type) {}

        get type():Type {
            return this._type
        }
    }

    export class Type extends AstNode {}

    export class UnionType extends Type implements AstNodesArray<PrimaryType> {
        constructor(subNodes:PrimaryType[], private _parent:AstNode = NIL) {
            super(_parent)
            // TODO: verify is safe?  {} <- []
            this.children = <any>_.clone(subNodes)
        }
    }

    export class PrimaryType extends Type {}

    export class PredefinedType extends PrimaryType {
        constructor(private _actualType:string) {}

        get actualType():string {
            return this.actualType
        }
    }

    export class TypeReference extends PrimaryType {
        constructor(private _qualifiedName:QualifiedName,
                    private _typeArguments:TypeArguments = NIL) {}

        get qualifiedName():QualifiedName {
            return this._qualifiedName
        }

        get typeArguments():TypeArguments {
            return this._typeArguments
        }
    }

    export class ObjectType extends PrimaryType {
        constructor(private _typeBody:TypeBody = NIL) {}

        get typeBody():TypeBody {
            return this._typeBody
        }
    }

    export class TupleType extends PrimaryType implements AstNodesArray<Type> {
        constructor(subNodes:PrimaryType[], private _parent:AstNode = NIL) {
            super(_parent)
            this.children = <any>_.clone(subNodes)
        }
    }

    export class TypeQuery extends PrimaryType {
        constructor(private _qualifiedName:QualifiedName) {}

        get qualifiedName():QualifiedName {
            return this._qualifiedName
        }
    }

    export class TypeBody extends AstNodesArray<TypeMember> {}

    export class TypeMember extends AstNode {}

    export class PropertySignature extends TypeMember {
        constructor(private _propertyName:PropertyName,
                    private _optional:boolean,
                    private _TypeAnnotation:TypeAnnotation = NIL) {}

        get propertyName():PropertyName {
            return this._propertyName
        }

        get optional():boolean {
            return this._optional
        }

        get typeAnnotation():TypeAnnotation {
            return this._TypeAnnotation
        }
    }

    export class MethodSignature extends TypeMember {
        constructor(private _propertyName:PropertyName,
                    private _optional:boolean,
                    // TODO: call signature optional or not?
                    private _callSignature:CallSignature = NIL) {}

        get propertyName():PropertyName {
            return this._propertyName
        }

        get optional():boolean {
            return this._optional
        }

        get callSignature():CallSignature {
            return this._callSignature
        }
    }

    // TODO: consider 3 separate types of propertyName classes(Identifier/StringLiteral/NumberLiteral)
    export class PropertyName extends AstNode {
        constructor(private _name:string) {}

        get name():boolean {
            return this.name
        }
    }


    export class CallSignature extends TypeMember {
        constructor(private _typeParameters:TypeParameters = NIL,
                    private _parameterList:ParameterList = NIL,
                    private _typeAnnotation:TypeAnnotation = NIL) {}

        get typeParameters():TypeParameters {
            return this._typeParameters
        }

        get parameterList():ParameterList {
            return this._parameterList
        }

        get typeAnnotation():TypeAnnotation {
            return this._typeAnnotation
        }
    }

    export class ParameterList extends AstNodesArray<Parameter> {}

    export class Parameter extends AstNode {}

    export class RequiredOrOptionalParameter extends Parameter {
        constructor(private _accessibilityModifier:AccessibilityModifier = NIL,
                    private _identifier:Identifier,
                    private _optional:boolean = NIL,
                    private _typeAnnotation:TypeAnnotation = NIL) {}

        get accessibilityModifier():AccessibilityModifier {
            return this._accessibilityModifier
        }

        get identifier():Identifier {
            return this._identifier
        }

        get optional():boolean {
            return this._optional
        }

        get typeAnnotation():TypeAnnotation {
            return this._typeAnnotation
        }
    }

    export class RestParameter extends Parameter {
        constructor(private _identifier:Identifier,
                    private _typeAnnotation:TypeAnnotation = NIL) {}

        get identifier():Identifier {
            return this._identifier
        }

        get typeAnnotation():TypeAnnotation {
            return this._typeAnnotation
        }
    }

    export class ConstructSignature extends TypeMember {
        constructor(private _callSignature:CallSignature = NIL) {}

        get identifier():Identifier {
            return this._identifier
        }

        get callSignature():CallSignature {
            return this._callSignature
        }
    }

    export class AccessibilityModifier extends AstNode {}
    export class PublicModifier extends AccessibilityModifier {}
    export class PrivateModifier extends AccessibilityModifier {}
    export class ProtectedModifier extends AccessibilityModifier {}


    export enum IndexType {STRING, NUMBER}
    export class IndexSignature extends TypeMember {
        constructor(private _identifier:Identifier,
                    private _indexType:IndexType,
                    private _typeAnnotation:TypeAnnotation) {}

        get identifier():Identifier {
            return this._identifier
        }

        get indexType():IndexType {
            return this._indexType
        }

        get typeAnnotation():TypeAnnotation {
            return this._typeAnnotation
        }
    }

    export class FunctionType extends Type {}

    export class ConstructorType extends Type {}

    export class TypeArguments extends AstNodesArray<Type> {}

    export class DeclarationElements extends AstNodesArray<DeclarationElement> {}

    export class DeclarationElement extends AstNode {}

    export class TypeAliasDeclaration extends DeclarationElement {
        constructor(private _identifier:Identifier,
                    private _type:Type) {}

        get identifier():Identifier {
            return this._identifier
        }

        get type():Type {
            return this._type
        }
    }

    export class TypeAnnotation extends AstNode {
        constructor(private _type:Type) {}

        get type():Type {
            return this._type
        }
    }

    export class InterfaceDeclaration extends DeclarationElement {

        constructor(private _identifier:Identifier,
                    private _objectType:ObjectType,
                    private _typeParameters:TypeParameters = NIL,
                    private _interfaceExtendsClause:InterfaceExtendsClause = NIL) {}

        get identifier():Identifier {
            return this._identifier
        }

        get objectType():ObjectType {
            return this._objectType
        }

        get typeParameters():TypeParameters {
            return this._typeParameters
        }

        get interfaceExtendsClause():InterfaceExtendsClause {
            return this._interfaceExtendsClause
        }
    }


    export class InterfaceExtendsClause extends AstNode {
        constructor(private _classOrInterfaceTypeList:ClassOrInterfaceTypeList) {}

        get classOrInterfaceTypeList():ClassOrInterfaceTypeList {
            return this._classOrInterfaceTypeList
        }
    }

    export class ClassOrInterfaceTypeList extends AstNodesArray<TypeReference> {}

    export class ClassHeritage extends AstNode {

        constructor(private _classExtendsClause:ClassExtendsClause = NIL,
                    private _implementsClause:ImplementsClause = NIL) {}

        get classExtendsClause():ClassExtendsClause {
            return this._classExtendsClause
        }

        get implementsClause():ImplementsClause {
            return this._implementsClause
        }
    }

    export class ClassExtendsClause extends AstNode {
        constructor(private _typeReference:TypeReference) {}

        get typeReference():TypeReference {
            return this._typeReference
        }
    }

    export class ImplementsClause extends AstNode {
        constructor(private _classOrInterfaceTypeList:ClassOrInterfaceTypeList) {}

        get classOrInterfaceTypeList():ClassOrInterfaceTypeList {
            return this._classOrInterfaceTypeList
        }
    }

    export class ImplementsClause extends AstNode {
        constructor(private _identifier:Identifier,
                    private _isConst:boolean,
                    private _enumBody:EnumBody = NIL) {}

        get identifier():Identifier {
            return this._identifier
        }

        get isConst():boolean {
            return this._isConst
        }

        get enumBody():EnumBody {
            return this._enumBody
        }
    }

    export class EnumBody extends AstNodesArray<EnumMember> {}

    export class EnumMember extends AstNode {
        constructor(private _propertyName:PropertyName) {}

        get propertyName():PropertyName {
            return this._propertyName
        }
    }

    export class ImportDeclaration extends DeclarationElement {
        constructor(private _identifier:Identifier,
                    private _qualifiedName:QualifiedName) {}

        get identifier():Identifier {
            return this._identifier
        }

        get qualifiedName():QualifiedName {
            return this._qualifiedName
        }
    }

    // TODO: extends ???
    export class ExternalImportDeclaration extends AstNode {
        constructor(private _identifier:Identifier,
                    private _externalModuleReference:ExternalModuleReference) {}

        get identifier():Identifier {
            return this._identifier
        }

        get externalModuleReference():ExternalModuleReference {
            return this._externalModuleReference
        }
    }

    export class ExternalModuleReference extends AstNode {
        constructor(private _refModuleName:string) {}

        get refModuleName():string {
            return this._refModuleName
        }
    }

    export class ExportAssignment extends DeclarationElement {
        constructor(private _identifier:Identifier) {}

        get identifier():Identifier {
            return this._identifier
        }
    }

    export class AmbientDeclaration extends DeclarationElement {}

    export class AmbientVariableDeclaration extends AmbientDeclaration {
        constructor(private _identifier:Identifier,
                    private _typeAnnotation:TypeAnnotation = NIL) {}

        get identifier():Identifier {
            return this._identifier
        }

        get typeAnnotation():TypeAnnotation {
            return this._typeAnnotation
        }
    }

    export class AmbientFunctionDeclaration extends AmbientDeclaration {
        constructor(private _identifier:Identifier,
                    private _callSignature:CallSignature) {}

        get identifier():Identifier {
            return this._identifier
        }

        get callSignature():CallSignature {
            return this._callSignature
        }
    }

    export class AmbientClassDeclaration extends AmbientDeclaration {

        constructor(private _identifier:Identifier,
                    private _classHeritage:ClassHeritage,
                    private _ambientClassBody:AmbientClassBody,
                    private _typeParameters:TypeParameters = NIL) {}

        get identifier():Identifier {
            return this._identifier
        }

        get classHeritage():ClassHeritage {
            return this._classHeritage
        }

        get ambientClassBody():AmbientClassBody {
            return this._ambientClassBody
        }

        get typeParameters():TypeParameters {
            return this._typeParameters
        }
    }

    export class AmbientClassBody extends AstNodesArray<AmbientClassBodyElement> {}

    export class AmbientClassBodyElement extends AstNode {}

    export class AmbientConstructorDeclaration extends AmbientClassBodyElement {
        constructor(private _parameterList:ParameterList) {}

        get parameterList():ParameterList {
            return this._parameterList
        }
    }

    export class AmbientPropertyMemberDeclaration extends AmbientClassBodyElement {
        constructor(private _propertyName:PropertyName,
                    private _accessibilityModifier:AccessibilityModifier = NIL,
                    private _isStatic:boolean = false,
                    private _parent:AstNode = NIL) {}

        get propertyName():PropertyName {
            return this._propertyName
        }

        get accessibilityModifier():AccessibilityModifier {
            return this._accessibilityModifier
        }

        get isStatic():Boolean {
            return this._isStatic
        }
    }

    export class PropertyMemberDeclarationWithCallSignature extends AmbientPropertyMemberDeclaration {
        constructor(_propertyName:PropertyName,
                    _accessibilityModifier:AccessibilityModifier = NIL,
                    _isStatic:boolean = false,
                    private _callSignature:CallSignature = NIL,
                    private _parent:AstNode = NIL) {
            super(_propertyName, _accessibilityModifier, _isStatic, _parent)
        }

        get callSignature():CallSignature {
            return this._callSignature
        }
    }

    export class PropertyMemberDeclarationWithTypeAnnotation extends AmbientPropertyMemberDeclaration {
        constructor(_propertyName:PropertyName,
                    _accessibilityModifier:AccessibilityModifier = NIL,
                    _isStatic:boolean = false,
                    private _typeAnnotation:TypeAnnotation = NIL,
                    private _parent:AstNode = NIL) {
            super(_propertyName, _accessibilityModifier, _isStatic, _parent)
        }

        get typeAnnotation():TypeAnnotation {
            return this._typeAnnotation
        }
    }

    // TODO: IndexSignature is also a TypeMember, duplicate?
    export class IndexSignatureInAmbientClassBody extends AmbientClassBodyElement {
        constructor(private _identifier:Identifier,
                    private _indexType:IndexType,
                    private _typeAnnotation:TypeAnnotation) {}

        get identifier():Identifier {
            return this._identifier
        }

        get indexType():IndexType {
            return this._indexType
        }

        get typeAnnotation():TypeAnnotation {
            return this._typeAnnotation
        }
    }

    export class AmbientModuleDeclaration extends AmbientDeclaration {
        constructor(private _qualifiedName:QualifiedName,
                    private _ambientModuleBody:AmbientModuleBody) {}

        get qualifiedName():QualifiedName {
            return this._qualifiedName
        }

        get ambientModuleBody():AmbientModuleBody {
            return this._ambientModuleBody
        }
    }


    export class AmbientModuleBody extends AstNodesArray<AmbientModuleElement> {}

    export class AmbientModuleElement extends AstNode {
        constructor(private _isExported:boolean) {}

        get isExported():boolean {
            return this._isExported
        }
    }


    export class Identifier extends AstNode {
        constructor(private _name:string) {}

        get name():string {
            return this._name
        }
    }

}
