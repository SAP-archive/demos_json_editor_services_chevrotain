namespace jes.ast {

    import AstNode = jes.core.ast.AstNode
    import AstNodesArray = jes.core.ast.AstNodesArray
    import NIL = jes.core.ast.NIL

    export class DeclarationSourceFile extends AstNode {

        constructor(protected _declarationElements:DeclarationElements, _parent:AstNode = NIL) {
            super(_parent)
        }

        get declarationElements():DeclarationElements {
            return this._declarationElements
        }
    }

    export class DeclarationElements extends AstNodesArray<DeclarationElement> {}

    export class QualifiedName extends AstNodesArray<Identifier> {}

    export class TypeParameters extends AstNodesArray<TypeParameter> {}

    export class TypeParameter extends AstNode {
        constructor(protected _identifier:Identifier,
                    protected _constraint:Constraint = NIL, _parent:AstNode = NIL) {
            super(_parent)
        }

        get identifier():Identifier {
            return this._identifier
        }

        get constraint():Constraint {
            return this._constraint
        }
    }

    export class Constraint extends AstNode {
        constructor(protected _type:Type,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get type():Type {
            return this._type
        }
    }

    export class Type extends AstNode {}

    // TODO: implement the common behavior from AstNodesArray using a runtime js mixin.
    export class UnionType extends Type /*mixes AstNodesArray<PrimaryType>*/ {

        _children:PrimaryType[]

        constructor(subNodes:PrimaryType[],
                    _parent:AstNode = NIL) {
            super(_parent)
            // TODO: verify is safe?  {} <- []
            this._children = <any>_.clone(subNodes)
        }

        children():AstNode[] {
            return this._children
        }
    }

    export class PrimaryType extends Type {}

    export class PredefinedType extends PrimaryType {
        constructor(protected _actualType:string,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get actualType():string {
            return this._actualType
        }
    }

    export class TypeReference extends PrimaryType {
        constructor(protected _qualifiedName:QualifiedName,
                    protected _typeArguments:TypeArguments = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get qualifiedName():QualifiedName {
            return this._qualifiedName
        }

        get typeArguments():TypeArguments {
            return this._typeArguments
        }
    }

    export class ObjectType extends PrimaryType {
        constructor(protected _typeBody:TypeBody = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get typeBody():TypeBody {
            return this._typeBody
        }
    }

    // TODO: implement the common behavior from AstNodesArray using a runtime js mixin.
    export class TupleType extends PrimaryType /*mixes AstNodesArray<PrimaryType>*/ {

        protected _children:PrimaryType[] = []

        constructor(subNodes:PrimaryType[],
                    _parent:AstNode = NIL) {
            super(_parent)
            this.children = <any>_.clone(subNodes)
        }

        children():AstNode[] {
            return this._children
        }
    }

    export class TypeQuery extends PrimaryType {
        constructor(protected _qualifiedName:QualifiedName,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get qualifiedName():QualifiedName {
            return this._qualifiedName
        }
    }

    export class TypeBody extends AstNodesArray<TypeMember> {}

    export class TypeMember extends AstNode {}

    export class PropertySignature extends TypeMember {
        constructor(protected _propertyName:PropertyName,
                    protected _optional:boolean,
                    protected _TypeAnnotation:TypeAnnotation = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

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
        constructor(protected _propertyName:PropertyName,
                    protected _optional:boolean,
                    // TODO: call signature optional or not?
                    protected _callSignature:CallSignature = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

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
        constructor(protected _name:string,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get name():string {
            return this._name
        }
    }

    export class CallSignature extends TypeMember {
        constructor(protected _typeParameters:TypeParameters = NIL,
                    protected _parameterList:ParameterList = NIL,
                    protected _typeAnnotation:TypeAnnotation = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

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
        constructor(protected _identifier:Identifier,
                    protected _accessibilityModifier:AccessibilityModifier = NIL,
                    protected _optional:boolean = NIL,
                    protected _typeAnnotation:TypeAnnotation = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

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
        constructor(protected _identifier:Identifier,
                    protected _typeAnnotation:TypeAnnotation = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get identifier():Identifier {
            return this._identifier
        }

        get typeAnnotation():TypeAnnotation {
            return this._typeAnnotation
        }
    }

    export class ConstructSignature extends TypeMember {
        constructor(protected _callSignature:CallSignature = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
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
        constructor(protected _identifier:Identifier,
                    protected _indexType:IndexType,
                    protected _typeAnnotation:TypeAnnotation,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

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

    export class DeclarationElement extends AstNode {}

    export class TypeAliasDeclaration extends DeclarationElement {
        constructor(protected _identifier:Identifier,
                    protected _type:Type,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get identifier():Identifier {
            return this._identifier
        }

        get type():Type {
            return this._type
        }
    }

    export class TypeAnnotation extends AstNode {
        constructor(protected _type:Type,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get type():Type {
            return this._type
        }
    }

    export class InterfaceDeclaration extends DeclarationElement {

        constructor(protected _identifier:Identifier,
                    protected _objectType:ObjectType,
                    protected _typeParameters:TypeParameters = NIL,
                    protected _interfaceExtendsClause:InterfaceExtendsClause = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

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
        constructor(protected _classOrInterfaceTypeList:ClassOrInterfaceTypeList,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get classOrInterfaceTypeList():ClassOrInterfaceTypeList {
            return this._classOrInterfaceTypeList
        }
    }

    export class ClassOrInterfaceTypeList extends AstNodesArray<TypeReference> {}

    export class ClassHeritage extends AstNode {

        constructor(protected _classExtendsClause:ClassExtendsClause = NIL,
                    protected _implementsClause:ImplementsClause = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get classExtendsClause():ClassExtendsClause {
            return this._classExtendsClause
        }

        get implementsClause():ImplementsClause {
            return this._implementsClause
        }
    }

    export class ClassExtendsClause extends AstNode {
        constructor(protected _typeReference:TypeReference,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get typeReference():TypeReference {
            return this._typeReference
        }
    }

    export class ImplementsClause extends AstNode {
        constructor(protected _classOrInterfaceTypeList:ClassOrInterfaceTypeList,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get classOrInterfaceTypeList():ClassOrInterfaceTypeList {
            return this._classOrInterfaceTypeList
        }
    }

    export class AmbientDeclaration extends DeclarationElement {}

    export class AmbientEnumDeclaration extends AmbientDeclaration {
        constructor(protected _identifier:Identifier,
                    protected _isConst:boolean = false,
                    protected _enumBody:EnumBody = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

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
        constructor(protected _propertyName:PropertyName,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get propertyName():PropertyName {
            return this._propertyName
        }
    }

    export class ImportDeclaration extends DeclarationElement {
        constructor(protected _identifier:Identifier,
                    protected _qualifiedName:QualifiedName,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get identifier():Identifier {
            return this._identifier
        }

        get qualifiedName():QualifiedName {
            return this._qualifiedName
        }
    }

    // TODO: extends ???
    export class ExternalImportDeclaration extends AstNode {
        constructor(protected _identifier:Identifier,
                    protected _externalModuleReference:ExternalModuleReference,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get identifier():Identifier {
            return this._identifier
        }

        get externalModuleReference():ExternalModuleReference {
            return this._externalModuleReference
        }
    }

    export class ExternalModuleReference extends AstNode {
        constructor(protected _refModuleName:string,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get refModuleName():string {
            return this._refModuleName
        }
    }

    export class ExportAssignment extends DeclarationElement {
        constructor(protected _identifier:Identifier,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get identifier():Identifier {
            return this._identifier
        }
    }

    export class AmbientVariableDeclaration extends AmbientDeclaration {
        constructor(protected _identifier:Identifier,
                    protected _typeAnnotation:TypeAnnotation = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get identifier():Identifier {
            return this._identifier
        }

        get typeAnnotation():TypeAnnotation {
            return this._typeAnnotation
        }
    }

    export class AmbientFunctionDeclaration extends AmbientDeclaration {
        constructor(protected _identifier:Identifier,
                    protected _callSignature:CallSignature,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get identifier():Identifier {
            return this._identifier
        }

        get callSignature():CallSignature {
            return this._callSignature
        }
    }

    export class AmbientClassDeclaration extends AmbientDeclaration {

        constructor(protected _identifier:Identifier,
                    protected _classHeritage:ClassHeritage,
                    protected _ambientClassBody:AmbientClassBody,
                    protected _typeParameters:TypeParameters = NIL,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

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
        constructor(protected _parameterList:ParameterList,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get parameterList():ParameterList {
            return this._parameterList
        }
    }

    export class AmbientPropertyMemberDeclaration extends AmbientClassBodyElement {
        constructor(protected _propertyName:PropertyName,
                    protected _accessibilityModifier:AccessibilityModifier = NIL,
                    protected _isStatic:boolean = false,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

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
                    protected _callSignature:CallSignature = NIL,
                    _parent:AstNode = NIL) {
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
                    protected _typeAnnotation:TypeAnnotation = NIL,
                    _parent:AstNode = NIL) {
            super(_propertyName, _accessibilityModifier, _isStatic, _parent)
        }

        get typeAnnotation():TypeAnnotation {
            return this._typeAnnotation
        }
    }

    // TODO: IndexSignature is also a TypeMember, duplicate?
    export class IndexSignatureInAmbientClassBody extends AmbientClassBodyElement {
        constructor(protected _identifier:Identifier,
                    protected _indexType:IndexType,
                    protected _typeAnnotation:TypeAnnotation,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

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
        constructor(protected _qualifiedName:QualifiedName,
                    protected _ambientModuleBody:AmbientModuleBody,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get qualifiedName():QualifiedName {
            return this._qualifiedName
        }

        get ambientModuleBody():AmbientModuleBody {
            return this._ambientModuleBody
        }
    }

    export class AmbientModuleBody extends AstNodesArray<AmbientModuleElement> {}

    export class AmbientModuleElement extends AstNode {
        constructor(protected _isExported:boolean,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get isExported():boolean {
            return this._isExported
        }
    }

    export class Identifier extends AstNode {
        constructor(protected _name:string,
                    _parent:AstNode = NIL) {
            super(_parent)
        }

        get name():string {
            return this._name
        }
    }

}
