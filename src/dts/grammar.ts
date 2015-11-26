namespace dts.grammar {

    import Token = chevrotain.Token
    import VirtualToken = chevrotain.VirtualToken
    import Lexer = chevrotain.Lexer
    import PT = pudu.parseTree.PT
    import ParseTree = pudu.parseTree.ParseTree

    // ----------------- Lexer -----------------

    // DIFF: no support for unicode identifiers
    export class Identifier extends Token { static PATTERN = /\w[\w\d]*/}


    // keywords - using Token suffix to avoid confusion with Typescript keywords/javascript native objects.
    export class Keyword extends Token {
        static PATTERN = Lexer.NA
        static LONGER_ALT = Identifier
    }

    export class ExportToken extends Keyword { static PATTERN = /export/}
    export class DeclareToken extends Keyword { static PATTERN = /declare/}
    export class ModuleToken extends Keyword { static PATTERN = /module/} // TODO: what about namespace kw?
    export class FunctionToken extends Keyword { static PATTERN = /function/}
    export class ClassToken extends Keyword { static PATTERN = /class/}
    export class ConstructorToken extends Keyword { static PATTERN = /Constructor/}
    export class StaticToken extends Keyword { static PATTERN = /static/}
    export class ExtendsToken extends Keyword { static PATTERN = /extends/}
    export class ImplementsToken extends Keyword { static PATTERN = /implements/}
    export class InterfaceToken extends Keyword { static PATTERN = /interface/}
    export class EnumToken extends Keyword { static PATTERN = /enum/}
    export class ConstToken extends Keyword { static PATTERN = /const/}
    export class ImportToken extends Keyword { static PATTERN = /import/}
    export class RequireToken extends Keyword { static PATTERN = /require/}
    export class VarToken extends Keyword { static PATTERN = /var/}
    export class AnyToken extends Keyword { static PATTERN = /any/}
    export class NumberToken extends Keyword { static PATTERN = /number/}
    export class BooleanToken extends Keyword { static PATTERN = /boolean/}
    export class StringToken extends Keyword { static PATTERN = /string/}
    export class VoidToken extends Keyword { static PATTERN = /void/}
    export class NewToken extends Keyword { static PATTERN = /new/}
    export class TypeofToken extends Keyword { static PATTERN = /typeof/}
    export class PrivateToken extends Keyword { static PATTERN = /private/}
    export class PublicToken extends Keyword { static PATTERN = /public]/}
    export class ProtectedToken extends Keyword { static PATTERN = /protected/}
    export class TypeToken extends Keyword { static PATTERN = /type/}

    // comments
    export class Comment extends Token {
        static PATTERN = Lexer.NA
        static GROUP = Lexer.SKIPPED
    }
    export class SingleLineComment extends Comment { static PATTERN = /\/\/.*/}
    export class MultiLineComment extends Comment { static PATTERN = /\/\*(.|\s)*?\*\//}

    // literals
    export class True extends Token { static PATTERN = /true/}
    export class False extends Token { static PATTERN = /false/}
    export class Null extends Token { static PATTERN = /null/}

    // DIFF - no single quotes strings
    export class StringLiteral extends Token {
        static PATTERN = /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"|'(:?[^\\'\n\r]+|\\(:?[bfnrtv'\\/]|u[0-9a-fA-F]{4}))*'/
    }
    export class NumberLiteral extends Token { static PATTERN = /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/}

    // punctuation
    export class LParen extends Token { static PATTERN = /\(/}
    export class RParen extends Token { static PATTERN = /\)/}
    export class LCurly extends Token { static PATTERN = /{/}
    export class RCurly extends Token { static PATTERN = /}/}
    export class LChevron extends Token { static PATTERN = /</}
    export class RChevron extends Token { static PATTERN = />/}
    export class LSquare extends Token { static PATTERN = /\[/}
    export class RSquare extends Token { static PATTERN = /]/}
    export class Comma extends Token { static PATTERN = /,/}
    export class Colon extends Token { static PATTERN = /:/}
    export class FatArrow extends Token { static PATTERN = /=>/}
    export class Equals extends Token { static PATTERN = /=/}
    export class Semicolon extends Token { static PATTERN = /;/}
    export class Pipe extends Token { static PATTERN = /\|/}
    export class Question extends Token { static PATTERN = /\?/}
    export class Dot extends Token { static PATTERN = /\./}
    export class DotDotDot extends Token { static PATTERN = /\.\.\./}


    export class WhiteSpace extends Token {
        static PATTERN = /\s+/
        static GROUP = Lexer.SKIPPED
    }

    let dtsTokens = [
        WhiteSpace,
        // keywords
        ExportToken, DeclareToken, ModuleToken, FunctionToken, ClassToken, ConstructorToken, StaticToken, ExtendsToken,
        ImplementsToken, InterfaceToken, EnumToken, ConstToken, ImportToken, RequireToken, VarToken, AnyToken, NumberToken,
        BooleanToken, StringToken, VoidToken, NewToken, TypeofToken, PrivateToken, PublicToken, ProtectedToken, TypeToken,
        // ident
        Identifier,
        // comments
        SingleLineComment,
        MultiLineComment,
        // literals
        True, False, Null, StringLiteral, NumberLiteral,
        // punctuation
        LParen, RParen, LCurly, RCurly, LChevron,
        RChevron, LSquare, RSquare, Comma, Colon, FatArrow, Equals, Semicolon, Pipe, Question, DotDotDot, Dot]

    export const DTSLexer = new Lexer(dtsTokens, true)

    export abstract class ParseTreeToken extends VirtualToken {}
    export abstract class SyntaxBox extends ParseTreeToken {}

    function SYNTAX_BOX(tokens:Token[]):ParseTree | any {
        let tokensCompcat = _.compact(tokens)
        let tokensTrees = _.map(tokensCompcat, (currToken) => PT(currToken))
        return _.isEmpty(tokensTrees) ? undefined : PT(SyntaxBox, tokensTrees)
    }

    function CHILDREN(...children:any[]):ParseTree[] {
        let flatChildren = _.flatten(<any>children, false)
        let existingFlatChildren = _.compact(flatChildren)

        return _.map(existingFlatChildren, (currChild:any) => {
            return currChild instanceof ParseTree ?
                currChild :
                PT(currChild)
        })
    }

    // PT prefix/suffix?
    export class DeclarationSourceFile extends ParseTreeToken {}
    export class QualifiedName extends ParseTreeToken {}
    export class TypeParameters extends ParseTreeToken {}
    export class TypeParameter extends ParseTreeToken {}
    export class Constraint extends ParseTreeToken {}
    export class TypeArguments extends ParseTreeToken {}

    export abstract class Type extends ParseTreeToken {}
    export class PrimaryOrUnionType extends Type {}
    export class PrimaryType extends Type {}
    export class ParenthesizedType extends Type {}

    export class PredefinedType extends ParseTreeToken {}
    export class TypeReference extends ParseTreeToken {}
    export class ObjectType extends ParseTreeToken {}
    export class TypeBody extends ParseTreeToken {}

    export abstract class TypeMember extends ParseTreeToken {}
    export class PropertySignatureOrMethodSignature extends TypeMember {}
    export class CallSignature extends TypeMember {}
    export class ConstructSignature extends TypeMember {}
    export class IndexSignature extends TypeMember {}


    export class TupleType extends ParseTreeToken {}
    export class FunctionType extends ParseTreeToken {}
    export class ConstructorType extends ParseTreeToken {}
    export class TypeQuery extends ParseTreeToken {}

    export class PropertyName extends ParseTreeToken {}
    export class ParameterList extends ParseTreeToken {}
    export class RequiredOrOptionalParameter extends ParseTreeToken {}
    export class RestParameter extends ParseTreeToken {}
    export class AccessibilityModifier extends ParseTreeToken {}
    export class TypeAliasDeclaration extends ParseTreeToken {}
    export class TypeAnnotation extends ParseTreeToken {}
    export class InterfaceDeclaration extends ParseTreeToken {}
    export class InterfaceExtendsClause extends ParseTreeToken {}
    export class ClassOrInterfaceTypeList extends ParseTreeToken {}
    export class ClassHeritage extends ParseTreeToken {}
    export class ClassExtendsClause extends ParseTreeToken {}
    export class ImplementsClause extends ParseTreeToken {}
    export class AmbientEnumDeclaration extends ParseTreeToken {}
    export class EnumBody extends ParseTreeToken {}
    export class EnumMember extends ParseTreeToken {}
    export class ImportDeclaration extends ParseTreeToken {}
    export class DeclarationElement extends ParseTreeToken {}
    export class ExternalModuleReference extends ParseTreeToken {}
    export class ExportAssignment extends ParseTreeToken {}
    export class AmbientDeclaration extends ParseTreeToken {}
    export class AmbientVariableDeclaration extends ParseTreeToken {}
    export class AmbientFunctionDeclaration extends ParseTreeToken {}
    export class AmbientClassDeclaration extends ParseTreeToken {}
    export class AmbientClassBody extends ParseTreeToken {}
    export class AmbientClassBodyElement extends ParseTreeToken {}
    export class AmbientConstructorDeclaration extends ParseTreeToken {}
    export class AmbientPropertyMemberDeclaration extends ParseTreeToken {}
    export class AmbientModuleDeclaration extends ParseTreeToken {}
    export class AmbientModuleBody extends ParseTreeToken {}
    export class AmbientModuleElement extends ParseTreeToken {}


    // ------------------------------------------------------------

    // ----------------- parser -----------------
    import Parser = chevrotain.Parser

    export class DTSParser extends Parser {

        constructor(input:Token[]) {
            super(input, dtsTokens)
            Parser.performSelfAnalysis(this)
        }


        /**
         * the top level rule
         */
        // DeclarationSourceFile:
        //    DeclarationElements?
        //
        // DeclarationElements:
        //    DeclarationElement
        //    DeclarationElements DeclarationElement
        public DeclarationSourceFile = this.RULE("DeclarationSourceFile", () => {
            let declarationElements = []

            this.MANY(() => {
                declarationElements.push(
                    this.SUBRULE(this.DeclarationElement))
            })

            return PT(DeclarationSourceFile, CHILDREN(declarationElements))
        })


        // EntityName:
        //    ModuleName
        //    ModuleName '.' Identifier
        //
        // TypeName:
        //    Identifier
        //    ModuleName '.' Identifier
        //
        // ModuleName:
        //    Identifier
        //    ModuleName '.' Identifier
        //
        // TypeQueryExpression:
        //    Identifier
        //    TypeQueryExpression '.' IdentifierName
        public QualifiedName = this.RULE("QualifiedName", () => {

            let idents = []

            let dots =
                this.AT_LEAST_ONE_SEP(Dot, () => {
                    idents.push(
                        this.CONSUME(Identifier))
                }, "identifier")

            return PT(QualifiedName, CHILDREN(idents, SYNTAX_BOX(dots)))
        })


        // A.1 Types


        // TypeParameters:
        //    '<' TypeParameterList '>'

        // TypeParameterList:
        //    TypeParameter
        //    TypeParameterList ',' TypeParameter
        public TypeParameters = this.RULE("TypeParameters", () => {
            let sb = []
            let typeParams = []

            sb.push(
                this.CONSUME(LChevron))

            let commas =
                this.AT_LEAST_ONE_SEP(Comma, () => {
                    typeParams.push(
                        this.SUBRULE(this.TypeParameter))
                }, "A Type Parameter")

            sb.push(
                this.CONSUME(RChevron))

            return PT(TypeParameters, CHILDREN(typeParams, SYNTAX_BOX(sb.concat(commas))))
        })


        // TypeParameter:
        //    Identifier Constraint?
        public TypeParameter = this.RULE("TypeParameter", () => {
            let constraint = undefined

            let ident =
                this.CONSUME(Identifier)
            this.OPTION(() => {
                constraint =
                    this.SUBRULE(this.Constraint)
            })

            return PT(TypeParameters, CHILDREN(ident, constraint))
        })


        // Constraint:
        //    'extends' Type
        public Constraint = this.RULE("Constraint", () => {
            let sb = []

            sb.push(
                this.CONSUME(ExtendsToken))

            let type =
                this.SUBRULE(this.Type)

            return PT(Constraint, CHILDREN(type, SYNTAX_BOX(sb)))
        })


        // TypeArguments:
        //    '<' TypeArgumentList '>'
        //
        // TypeArgumentList:
        //    TypeArgument
        //    TypeArgumentList ',' TypeArgument
        //
        // TypeArgument:
        //    Type
        public TypeArguments = this.RULE("TypeArguments", () => {
            let sb = []
            let types = []

            sb.push(
                this.CONSUME(LChevron))

            let commas =
                this.AT_LEAST_ONE_SEP(Comma, () => {
                    types.push(
                        this.SUBRULE(this.Type))
                }, "A Type")

            sb.push(
                this.CONSUME(RChevron))

            return PT(TypeArguments, CHILDREN(types, SYNTAX_BOX(sb.concat(commas))))
        })


        // TypeArgument:
        //    Type
        //
        // Type:
        //    PrimaryOrUnionType
        //    FunctionType
        //    ConstructorType
        public Type = this.RULE("Type", () => {
            return this.OR([
                {ALT: () =>  this.SUBRULE(this.PrimaryOrUnionType)}, // TODO: fix: parentheses type same prefix as FunctionType
                {ALT: () =>  this.SUBRULE(this.FunctionType)},
                {ALT: () =>  this.SUBRULE(this.ConstructorType)},
            ], "a Type")
        })


        // PrimaryOrUnionType:
        //    PrimaryType
        //    UnionType

        // UnionType:
        //    PrimaryOrUnionType '|' PrimaryType
        public PrimaryOrUnionType = this.RULE("PrimaryOrUnionType", () => {
            let primTypes = []

            let commas =
                this.AT_LEAST_ONE_SEP(Pipe, () => {
                    primTypes.push(
                        this.SUBRULE(this.PrimaryType))
                }, "A Type")

            return PT(PrimaryOrUnionType, CHILDREN(primTypes, SYNTAX_BOX(commas)))
        })


        // PrimaryType:
        //    ParenthesizedType
        //    PredefinedType
        //    TypeReference
        //    ObjectType
        //    ArrayType
        //    TupleType
        //    TypeQuery
        public PrimaryType = this.RULE("PrimaryType", () => {
            let brackets = []

            let type =
                this.OR([
                    //{ALT: () =>  this.SUBRULE(this.ParenthesizedType)}, // DIFF -
                    // needs to be combined with FunctionType due to same prefix and unknown lookahead
                    {ALT: () =>  this.SUBRULE(this.PredefinedType)},
                    {ALT: () =>  this.SUBRULE(this.TypeReference)},
                    {ALT: () =>  this.SUBRULE(this.ObjectType)},
                    {ALT: () =>  this.SUBRULE(this.TupleType)},
                    {ALT: () =>  this.SUBRULE(this.TypeQuery)}
                ], "a Primary or Union type")

            // ArrayType:
            //    PrimaryType [no LineTerminator here] '[' ']'
            //
            // refactored to avoid left recursion, the grammar in the spec was too lenient
            // allowing 'string string string [] [] []' for example
            // this only allows array '[]' as a suffix
            this.MANY(() => {
                brackets.push(
                    this.CONSUME(LSquare))
                brackets.push(
                    this.CONSUME(RSquare))
            })

            return PT(PrimaryType, CHILDREN(type, brackets, SYNTAX_BOX(brackets)))
        })


        // ParenthesizedType:
        //    '(' Type ')'
        //public ParenthesizedType = this.RULE("ParenthesizedType", () => {
        //    let brackets = []
        //
        //    brackets.push(
        //        this.CONSUME(LParen))
        //    let type =
        //        this.SUBRULE(this.Type)
        //    brackets.push(
        //        this.CONSUME(RParen))
        //
        //    return PT(ParenthesizedType, CHILDREN(type, SYNTAX_BOX(brackets)))
        //})


        // PredefinedType:
        //    any
        //    number
        //    boolean
        //    string
        //    void
        public PredefinedType = this.RULE("PredefinedType", () => {
            return PT(PredefinedType, CHILDREN(
                this.OR([
                    // TODO: consider reducing number of keywords by consuming these predefined types as simple identifiers
                    {ALT: () =>  this.CONSUME(AnyToken)},
                    {ALT: () =>  this.CONSUME(NumberToken)},
                    {ALT: () =>  this.CONSUME(BooleanToken)},
                    {ALT: () =>  this.CONSUME(StringToken)},
                    {ALT: () =>  this.CONSUME(VoidToken)},
                ], "a predefined type")))
        })


        // TypeReference:
        //    TypeName [no LineTerminator here] TypeArguments?
        public TypeReference = this.RULE("TypeReference", () => {
            let qn, typeArgs = undefined

            qn =
                this.SUBRULE(this.QualifiedName)
            // [no LineTerminator here] should be implemented as parts of a later checks phase
            this.OPTION(() => {
                typeArgs =
                    this.SUBRULE(this.TypeArguments)
            })

            return PT(TypeReference, CHILDREN(qn, typeArgs))
        })


        // ObjectType:
        //    '{' TypeBody? '}'
        public ObjectType = this.RULE("ObjectType", () => {
            let body = undefined, brackets = []

            brackets.push(
                this.CONSUME(LCurly))

            this.OPTION(() => {
                body =
                    this.SUBRULE(this.TypeBody)
            })
            brackets.push(
                this.CONSUME(RCurly))

            return PT(ObjectType, CHILDREN(body, SYNTAX_BOX(brackets)))
        })


        // TypeBody:
        //    TypeMemberList ;?
        //
        // TypeMemberList:
        //    TypeMember
        //    TypeMemberList ';' TypeMember
        public TypeBody = this.RULE("TypeBody", () => {
            let semicolons = [], typeMembers = []

            this.MANY(() => {
                typeMembers.push(
                    this.SUBRULE(this.TypeMember))
                semicolons.push(
                    this.CONSUME(Semicolon))
            })
            // DIFF last semiColon is currently mandatory
            //this.OPTION(() => {
            //    this.CONSUME(Semicolon)
            //})

            return PT(TypeBody, CHILDREN(typeMembers, SYNTAX_BOX(semicolons)))
        })


        // TypeMember:
        //    PropertySignature
        //    CallSignature
        //    ConstructSignature
        //    IndexSignature
        //    MethodSignature
        public TypeMember = this.RULE("TypeMember", () => {
            return this.OR([
                {ALT: () =>  this.SUBRULE(this.PropertySignatureOrMethodSignature)},
                {ALT: () =>  this.SUBRULE(this.CallSignature)},
                {ALT: () =>  this.SUBRULE(this.ConstructSignature)},
                {ALT: () =>  this.SUBRULE(this.IndexSignature)},
            ], "a Type Member")
        })


        // TupleType:
        //    '[' TupleElementTypes ']'
        //
        // TupleElementTypes:
        //    TupleElementType
        //    TupleElementTypes ',' TupleElementType
        //
        // TupleElementType:
        //    Type
        public TupleType = this.RULE("TupleType", () => {
            let commas, brackets = [], types = []

            brackets.push(
                this.CONSUME(LSquare))
            commas =
                this.MANY_SEP(Comma, () => {
                    types.push(
                        this.SUBRULE(this.Type))
                })
            brackets.push(
                this.CONSUME(RSquare))

            return PT(TupleType, CHILDREN(types, SYNTAX_BOX(brackets.concat(commas))))
        })


        // FunctionType:
        //    TypeParameters? ( ParameterList? ) => Type
        public FunctionType = this.RULE("FunctionType", () => {
            let typeParams = undefined, paramList = undefined, type, sb = []

            this.OPTION(() => {
                typeParams =
                    this.SUBRULE(this.TypeParameters)
            })
            sb.push(
                this.CONSUME(LParen))
            this.OPTION2(() => {
                paramList =
                    this.SUBRULE(this.ParameterList)
            })
            sb.push(
                this.CONSUME(RParen))
            sb.push(
                this.CONSUME(FatArrow))
            type =
                this.SUBRULE(this.Type)

            return PT(FunctionType, CHILDREN(typeParams, paramList, type, SYNTAX_BOX(sb)))
        })


        // ConstructorType:
        //    'new' TypeParameters? ( ParameterList? ) '=>' Type
        public ConstructorType = this.RULE("ConstructorType", () => {
            let funcType, sb = []

            sb.push(
                this.CONSUME(NewToken))
            funcType =
                this.SUBRULE(this.FunctionType)

            return PT(ConstructorType, CHILDREN(funcType, SYNTAX_BOX(sb)))
        })


        // TypeQuery:
        //    'typeof' TypeQueryExpression
        public TypeQuery = this.RULE("TypeQuery", () => {
            let qn, sb = []

            sb.push(
                this.CONSUME(TypeofToken))
            qn =
                this.SUBRULE(this.QualifiedName)

            return PT(TypeQuery, CHILDREN(qn, SYNTAX_BOX(sb)))
        })


        // PropertySignature:
        //    PropertyName '?'? TypeAnnotation?
        //
        // MethodSignature:
        //    PropertyName '?'? CallSignature // TODO: is CallSignature optional? it is implemented as optional right now
        public PropertySignatureOrMethodSignature = this.RULE("PropertySignatureOrMethodSignature", () => {
            let propName, typeAnnoOrCallSig = undefined, question = undefined

            propName =
                this.SUBRULE(this.PropertyName)
            this.OPTION(() => {
                question = this.CONSUME(Question)
            })
            this.OPTION2(() => {
                typeAnnoOrCallSig =
                    this.OR([
                        {ALT: () =>  this.SUBRULE(this.TypeAnnotation)},
                        {ALT: () =>  this.SUBRULE(this.CallSignature)},
                    ], "a TypeAnnotation or CallSignature")
            })

            return PT(PropertySignatureOrMethodSignature,
                CHILDREN(propName, typeAnnoOrCallSig,
                    SYNTAX_BOX(question)))
        })


        //PropertyName:
        //    IdentifierName
        //    StringLiteral
        //    NumericLiteral
        public PropertyName = this.RULE("PropertyName", () => {
            return PT(PropertyName, CHILDREN(
                this.OR([
                    {ALT: () =>  this.CONSUME(Identifier)},
                    {ALT: () =>  this.CONSUME(StringLiteral)},
                    {ALT: () =>  this.CONSUME(NumberLiteral)},
                ], "a PropertyName")))
        })


        // CallSignature:
        //    TypeParameters? '(' ParameterList? ')' TypeAnnotation?
        public CallSignature = this.RULE("CallSignature", () => {
            let typeParams = undefined, paramList = undefined, typeAnno = undefined, sb = []

            this.OPTION(() => {
                typeParams =
                    this.SUBRULE(this.TypeParameters)
            })
            sb.push(
                this.CONSUME(LParen))
            this.OPTION2(() => {
                paramList =
                    this.SUBRULE(this.ParameterList)
            })
            sb.push(
                this.CONSUME(RParen))
            this.OPTION3(() => {
                typeAnno =
                    this.SUBRULE(this.TypeAnnotation)
            })

            return PT(CallSignature, CHILDREN(typeParams, paramList, typeAnno, SYNTAX_BOX(sb)))
        })


        // ParameterList:
        //    RequiredParameterList
        //    OptionalParameterList
        //    RestParameter
        //    RequiredParameterList ',' OptionalParameterList
        //    RequiredParameterList ',' RestParameter
        //    OptionalParameterList ',' RestParameter
        //    RequiredParameterList ',' OptionalParameterList ',' RestParameter
        public ParameterList = this.RULE("ParameterList", () => {
            let params = [], sb

            sb =
                this.AT_LEAST_ONE_SEP(Comma, () => {
                    params.push(
                        this.OR([
                            {ALT: () =>  this.SUBRULE(this.RequiredOrOptionalParameter)},
                            {ALT: () =>  this.SUBRULE(this.RestParameter)},
                        ], "a Parameter signature"))
                }, "A Parameter List")

            return PT(ParameterList, CHILDREN(params, SYNTAX_BOX(sb)))
        })


        // RequiredParameter:
        //    AccessibilityModifier? Identifier TypeAnnotation?
        //    Identifier ':' StringLiteral // DIFF this variation is not supported yet

        // OptionalParameter:
        //    AccessibilityModifier? Identifier '?' TypeAnnotation?
        //    AccessibilityModifier? Identifier TypeAnnotation? Initialiser
        //    Identifier ? ':' StringLiteral // DIFF this variation is not supported yet
        public RequiredOrOptionalParameter = this.RULE("RequiredOrOptionalParameter", () => {
            let accessMod = undefined, ident, question = undefined, typeAnno = undefined

            this.OPTION(() => {
                accessMod =
                    this.SUBRULE(this.AccessibilityModifier)
            })
            ident =
                this.CONSUME(Identifier)

            this.OPTION2(() => {
                question =
                    this.CONSUME(Question)
            })
            this.OPTION3(() => {
                typeAnno =
                    this.SUBRULE(this.TypeAnnotation)
            })

            // initializer not permitted in d.ts
            // see 3.8.2.2 Parameter List in the spec
            return PT(RequiredOrOptionalParameter, CHILDREN(accessMod, ident, question, typeAnno, SYNTAX_BOX([ident, question])))
        })


        // RestParameter:
        //    '...' Identifier TypeAnnotation?
        public RestParameter = this.RULE("RestParameter", () => {
            let dots, ident, typeAnno = undefined

            dots =
                this.CONSUME(DotDotDot)
            ident =
                this.CONSUME(Identifier)

            this.OPTION(() => {
                typeAnno =
                    this.SUBRULE(this.TypeAnnotation)
            })

            return PT(RestParameter, CHILDREN(ident, typeAnno, SYNTAX_BOX([dots, ident])))
        })


        // ConstructSignature:
        //    'new' TypeParameters? '(' ParameterList? ')' TypeAnnotation?
        public ConstructSignature = this.RULE("ConstructSignature", () => {
            let newTok, callSig

            newTok =
                this.CONSUME(NewToken)
            callSig =
                this.SUBRULE(this.CallSignature)

            return PT(ConstructSignature, CHILDREN(callSig, SYNTAX_BOX([newTok])))
        })


        // AccessibilityModifier:
        //    'public'
        //    'private'
        //    'protected'
        public AccessibilityModifier = this.RULE("AccessibilityModifier", () => {
            return PT(AccessibilityModifier, CHILDREN(
                this.OR([
                    {ALT: () =>  this.CONSUME(PublicToken)},
                    {ALT: () =>  this.CONSUME(PrivateToken)},
                    {ALT: () =>  this.CONSUME(ProtectedToken)}
                ], "an accessibility Modifier")))
        })


        //IndexSignature:
        //    '[' Identifier ':' string ']' TypeAnnotation
        //    '[' Identifier ':' number ']' TypeAnnotation
        public IndexSignature = this.RULE("IndexSignature", () => {
            let lSq, ident, colon, strOrNum, rSq, typeAnno

            lSq =
                this.CONSUME(LSquare)
            ident =
                this.CONSUME(Identifier)
            colon =
                this.CONSUME(Colon)
            strOrNum =
                // @formatter:off
                this.OR([
                    {ALT: () =>  this.CONSUME(StringToken)},
                    {ALT: () =>  this.CONSUME(NumberToken)}
                    ], "'string' or 'number'")
                // @formatter:on
            rSq =
                this.CONSUME(RSquare)
            typeAnno =
                this.SUBRULE(this.TypeAnnotation)

            return PT(IndexSignature,
                CHILDREN(ident, typeAnno,
                    SYNTAX_BOX([lSq, ident, colon, strOrNum, rSq])))
        })


        // TypeAliasDeclaration:
        //    'type' Identifier '=' Type ';'
        public TypeAliasDeclaration = this.RULE("TypeAliasDeclaration", () => {
            let typeTok, ident, eq, type, semicolon

            typeTok =
                this.CONSUME(TypeToken)
            ident =
                this.CONSUME(Identifier)
            eq =
                this.CONSUME(Equals)
            type =
                this.SUBRULE(this.Type)
            semicolon =
                this.CONSUME(Semicolon)

            return PT(TypeAliasDeclaration,
                CHILDREN(ident, type,
                    SYNTAX_BOX([typeTok, ident, eq, semicolon])))
        })


        public TypeAnnotation = this.RULE("TypeAnnotation", () => {
            let colon, type

            colon =
                this.CONSUME(Colon)
            type =
                this.SUBRULE(this.Type)

            return PT(TypeAnnotation, CHILDREN(type, SYNTAX_BOX([colon])))
        })


        // A.5 Interfaces

        // InterfaceDeclaration:
        //    'interface' Identifier TypeParameters? InterfaceExtendsClause? ObjectType
        public InterfaceDeclaration = this.RULE("InterfaceDeclaration", () => {
            let interfaceTok, ident, typeParams = undefined, extendsClause = undefined, objType

            interfaceTok =
                this.CONSUME(InterfaceToken)
            ident =
                this.CONSUME(Identifier)

            this.OPTION(() => {
                typeParams =
                    this.SUBRULE(this.TypeParameters)
            })
            this.OPTION2(() => {
                extendsClause =
                    this.SUBRULE(this.InterfaceExtendsClause)
            })
            objType =
                this.SUBRULE(this.ObjectType)

            return PT(InterfaceDeclaration,
                CHILDREN(ident, typeParams, extendsClause, objType,
                    SYNTAX_BOX([interfaceTok, ident])))
        })


        // InterfaceExtendsClause:
        //    'extends' ClassOrInterfaceTypeList
        public InterfaceExtendsClause = this.RULE("InterfaceExtendsClause", () => {
            let extendsTok, typeList

            extendsTok =
                this.CONSUME(ExtendsToken)
            typeList =
                this.SUBRULE(this.ClassOrInterfaceTypeList)

            return PT(InterfaceExtendsClause, CHILDREN(typeList, SYNTAX_BOX([extendsTok])))
        })


        // ClassOrInterfaceTypeList:
        //    ClassOrInterfaceType
        //    ClassOrInterfaceTypeList ',' ClassOrInterfaceType
        //
        // ClassOrInterfaceType:
        //    TypeReference
        public ClassOrInterfaceTypeList = this.RULE("ClassOrInterfaceTypeList", () => {
            let commas, typeRefs = []

            commas = this.MANY_SEP(Comma, () => {
                typeRefs.push(
                    this.SUBRULE(this.TypeReference))
            })

            return PT(ClassOrInterfaceTypeList, CHILDREN(typeRefs, SYNTAX_BOX(commas)))
        })


        // A.6 Classes

        // ClassHeritage:
        //    ClassExtendsClause? ImplementsClause?
        public ClassHeritage = this.RULE("ClassHeritage", () => {
            let extendsClause = undefined, implementsClause = undefined

            this.OPTION(() => {
                extendsClause =
                    this.SUBRULE(this.ClassExtendsClause)
            })

            this.OPTION2(() => {
                implementsClause =
                    this.SUBRULE(this.ImplementsClause)
            })

            return PT(ClassHeritage, CHILDREN(extendsClause, implementsClause))
        })


        // ClassExtendsClause:
        //    'extends' ClassType
        // ClassType:
        //    TypeReference
        public ClassExtendsClause = this.RULE("ClassExtendsClause", () => {
            let extendsTok, typeRef

            extendsTok = this.CONSUME(ExtendsToken)
            typeRef = this.SUBRULE(this.TypeReference)

            return PT(ClassExtendsClause, CHILDREN(typeRef, SYNTAX_BOX([extendsTok])))
        })


        // ImplementsClause:
        //    'implements' ClassOrInterfaceTypeList
        public ImplementsClause = this.RULE("ImplementsClause", () => {
            let implementsTok, typeList

            implementsTok =
                this.CONSUME(ImplementsToken)
            typeList =
                this.SUBRULE(this.ClassOrInterfaceTypeList)

            return PT(ImplementsClause, CHILDREN(typeList, SYNTAX_BOX([implementsTok])))
        })


        // AmbientEnumDeclaration:
        //    EnumDeclaration
        //
        // EnumDeclaration:
        //    const? 'enum' Identifier '{' EnumBody? '}'
        public AmbientEnumDeclaration = this.RULE("AmbientEnumDeclaration", () => {
            let constTok = undefined, enumTok, ident, lCurly, enumBody = undefined, rCurly

            this.OPTION(() => {
                constTok =
                    this.CONSUME(ConstToken)
            })
            enumTok =
                this.CONSUME(EnumToken)
            ident =
                this.CONSUME(Identifier)
            lCurly =
                this.CONSUME(LCurly)

            this.OPTION2(() => {
                enumBody =
                    this.SUBRULE(this.EnumBody)
            })
            rCurly =
                this.CONSUME(RCurly)

            return PT(AmbientEnumDeclaration,
                CHILDREN(ConstToken, Identifier, enumBody,
                    SYNTAX_BOX([constTok, enumTok, ident, lCurly, rCurly])))
        })


        // EnumBody:
        //    EnumMemberList ','?
        //
        // EnumMemberList:
        //    EnumMember
        //    EnumMemberList ',' EnumMember
        public EnumBody = this.RULE("EnumBody", () => {
            let commas, members = []

            commas =
                this.MANY_SEP(Comma, () => {
                    members.push(
                        this.SUBRULE(this.EnumMember))
                })

            this.OPTION(() => {
                commas.push(this.CONSUME(Comma))
            })

            return PT(EnumBody,
                CHILDREN(members, SYNTAX_BOX(commas)))
        })


        // EnumMember:
        //    PropertyName
        //    PropertyName '=' EnumValue
        public EnumMember = this.RULE("EnumMember", () => {
            let propName

            propName =
                this.SUBRULE(this.PropertyName)

            // DIFF: no <ENUM '=' EnumValue>, maybe support only simple expressions?
            return PT(EnumMember, CHILDREN(propName))
        })


        // ImportDeclaration:
        //    'import' Identifier '=' EntityName ';'
        public ImportDeclaration = this.RULE("ImportDeclaration", () => {
            let importTok, ident, eq, qn, semicolon

            importTok =
                this.CONSUME(ImportToken)
            ident =
                this.CONSUME(Identifier)
            eq =
                this.CONSUME(Equals)
            qn =
                this.SUBRULE(this.QualifiedName) // EntityName
            semicolon =
                this.CONSUME(Semicolon)

            return PT(ImportDeclaration,
                CHILDREN(ident, qn,
                    SYNTAX_BOX([importTok, ident, eq, semicolon])))
        })


        // DeclarationElement:
        //    ExportAssignment
        //    AmbientExternalModuleDeclaration
        //    'export'? InterfaceDeclaration
        //    'export'? TypeAliasDeclaration
        //    'export'? ImportDeclaration
        //    'export'? AmbientDeclaration
        //    'export'? ExternalImportDeclaration
        public DeclarationElement = this.RULE("DeclarationElement", () => {
            let innerDecElement, exportTok = undefined

            innerDecElement =
                // @formatter:off
                this.OR([
                    {WHEN: isExportAssignment, THEN_DO: () => this.SUBRULE(this.ExportAssignment)},
                    // DIFF - need better lookahead to distinguish between AmbientExternalModuleDeclaration and AmbientModuleDeclaration
                    //{WHEN: isAmbientExternalModuleDeclaration , THEN_DO: () =>  this.SUBRULE(this.AmbientExternalModuleDeclaration)},
                    {WHEN: isOtherDeclarationElement, THEN_DO: () => {
                        this.OPTION(() => {
                            exportTok =
                                this.CONSUME(ExportToken)
                        })
                        return this.OR2([
                            {ALT: () => this.SUBRULE(this.InterfaceDeclaration)},
                            {ALT: () => this.SUBRULE(this.TypeAliasDeclaration)},
                            {ALT: () => this.SUBRULE(this.ImportDeclaration)},
                            {ALT: () => this.SUBRULE(this.AmbientDeclaration)}
                            //{ALT: () => this.SUBRULE(this.ExternalImportDeclaration)} // DIFF not currently supported
                            ], "Interface TypeAlias ImportDec AmbientDec or ExternalImportDec")}}
                    ], "a DeclarationElement")
                // @formatter:on

            return PT(DeclarationElement,
                CHILDREN(exportTok, innerDecElement,
                    SYNTAX_BOX([exportTok])))
        })


        // ExternalImportDeclaration:
        //    'import' Identifier '=' ExternalModuleReference ';'
        //public ExternalImportDeclaration = this.RULE("ExternalImportDeclaration", () => {
        //    this.CONSUME(ImportToken)
        //    this.CONSUME(Identifier)
        //    this.CONSUME(Equals)
        //    this.SUBRULE(this.ExternalModuleReference)
        //    this.CONSUME(Semicolon)
        //})


        // ExternalModuleReference:
        //    'require' '(' StringLiteral ')'
        public ExternalModuleReference = this.RULE("ExternalModuleReference", () => {
            let require, lParen, str, rParen

            require =
                this.CONSUME(RequireToken)
            lParen =
                this.CONSUME(LParen)
            str =
                this.CONSUME(StringLiteral)
            rParen =
                this.CONSUME(RParen)

            return PT(ExternalModuleReference,
                CHILDREN(str,
                    SYNTAX_BOX([require, lParen, str, rParen])))
        })


        // ExportAssignment:
        //    'export' '=' Identifier ';'
        public ExportAssignment = this.RULE("ExportAssignment", () => {
            let exportTok, eq, ident, semicolon

            exportTok =
                this.CONSUME(ExportToken)
            eq =
                this.CONSUME(Equals)
            ident =
                this.CONSUME(Identifier)
            semicolon =
                this.CONSUME(Semicolon)

            return PT(ExportAssignment,
                CHILDREN(ident,
                    SYNTAX_BOX([exportTok, eq, ident, semicolon])))
        })


        // A.10 Ambients

        // AmbientDeclaration:
        //    'declare' AmbientVariableDeclaration
        //    'declare' AmbientFunctionDeclaration
        //    'declare' AmbientClassDeclaration
        //    'declare' AmbientEnumDeclaration
        //    'declare' AmbientModuleDeclaration
        public AmbientDeclaration = this.RULE("AmbientDeclaration", () => {
            let declareTok, declaration

            declareTok = this.CONSUME(DeclareToken)
            declaration =
                this.OR([
                    {ALT: () =>  this.SUBRULE(this.AmbientVariableDeclaration)},
                    {ALT: () =>  this.SUBRULE(this.AmbientFunctionDeclaration)},
                    {ALT: () =>  this.SUBRULE(this.AmbientClassDeclaration)},
                    {ALT: () =>  this.SUBRULE(this.AmbientEnumDeclaration)},
                    {ALT: () =>  this.SUBRULE(this.AmbientModuleDeclaration)},
                ], "an AmbientDeclaration")

            return PT(AmbientDeclaration,
                CHILDREN(declaration,
                    SYNTAX_BOX([declareTok])))
        })


        // AmbientVariableDeclaration:
        //   'var' Identifier TypeAnnotation? ';'
        public AmbientVariableDeclaration = this.RULE("AmbientVariableDeclaration", () => {
            let varTok, ident, typeAnno = undefined, semiColon

            varTok =
                this.CONSUME(VarToken)
            ident =
                this.CONSUME(Identifier)

            this.OPTION(() => {
                typeAnno =
                    this.SUBRULE(this.TypeAnnotation)
            })
            semiColon =
                this.CONSUME(Semicolon)

            return PT(AmbientVariableDeclaration,
                CHILDREN(ident, typeAnno,
                    SYNTAX_BOX([varTok, ident, semiColon])))
        })


        // AmbientFunctionDeclaration:
        //    'function' Identifier CallSignature ';'
        public AmbientFunctionDeclaration = this.RULE("AmbientFunctionDeclaration", () => {
            let func, ident, callSig, semiColon

            func =
                this.CONSUME(FunctionToken)
            ident =
                this.CONSUME(Identifier)
            callSig =
                this.SUBRULE(this.CallSignature)
            semiColon =
                this.CONSUME(Semicolon)

            return PT(AmbientFunctionDeclaration,
                CHILDREN(ident, callSig,
                    SYNTAX_BOX([func, ident, semiColon])))
        })


        // AmbientClassDeclaration:
        //    'class' Identifier TypeParameters? ClassHeritage '{' AmbientClassBody '}'
        public AmbientClassDeclaration = this.RULE("AmbientClassDeclaration", () => {
            let classTok, ident, typeParam = undefined, heritage, lCurly, body, rCurly

            classTok =
                this.CONSUME(ClassToken)
            ident =
                this.CONSUME(Identifier)

            this.OPTION(() => {
                typeParam =
                    this.SUBRULE(this.TypeParameters)
            })
            heritage =
                this.SUBRULE(this.ClassHeritage)
            lCurly =
                this.CONSUME(LCurly)
            body =
                this.SUBRULE(this.AmbientClassBody)
            rCurly =
                this.CONSUME(RCurly)

            return PT(AmbientClassDeclaration,
                CHILDREN(ident, typeParam, heritage, body,
                    SYNTAX_BOX([classTok, ident, lCurly, rCurly])))
        })


        // AmbientClassBody:
        //    AmbientClassBodyElements?
        //
        // AmbientClassBodyElements:
        //    AmbientClassBodyElement
        //    AmbientClassBodyElements AmbientClassBodyElement
        public AmbientClassBody = this.RULE("AmbientClassBody", () => {
            let elements = []

            this.MANY(() => {
                elements.push(
                    this.SUBRULE(this.AmbientClassBodyElement))
            })

            return PT(AmbientClassBody,
                CHILDREN(elements))
        })


        // AmbientClassBodyElement:
        //    AmbientConstructorDeclaration
        //    AmbientPropertyMemberDeclaration
        //    IndexSignature
        public AmbientClassBodyElement = this.RULE("AmbientClassBodyElement", () => {
            return this.OR([
                {ALT: () =>  this.SUBRULE(this.AmbientConstructorDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientPropertyMemberDeclaration)},
                {ALT: () =>  this.SUBRULE(this.IndexSignature)},
            ], "an AmbientClassBodyElement")
        })


        // AmbientConstructorDeclaration:
        //    'constructor' '(' ParameterList? ')' ';'
        public AmbientConstructorDeclaration = this.RULE("AmbientConstructorDeclaration", () => {
            let constructorTok, lParen, paramList = undefined, rParen, semicolon

            constructorTok =
                this.CONSUME(ConstructorToken)
            lParen =
                this.CONSUME(LParen)

            this.OPTION(() => {
                paramList =
                    this.SUBRULE(this.ParameterList)
            })
            rParen =
                this.CONSUME(RParen)
            semicolon =
                this.CONSUME(Semicolon)

            return PT(AmbientConstructorDeclaration,
                CHILDREN(ParameterList,
                    SYNTAX_BOX([constructorTok, lParen, rParen, semicolon])))
        })


        // AmbientPropertyMemberDeclaration:
        //    AccessibilityModifier? 'static'? PropertyName TypeAnnotation? ';'
        //    AccessibilityModifier? 'static'? PropertyName CallSignature ';'
        public AmbientPropertyMemberDeclaration = this.RULE("AmbientPropertyMemberDeclaration", () => {
            let accessMod = undefined, staticTok = undefined, propName,
                typeAnnoOrCallSig = undefined, semicolon

            this.OPTION(() => {
                accessMod =
                    this.SUBRULE(this.AccessibilityModifier)
            })
            this.OPTION2(() => {
                staticTok =
                    this.CONSUME(StaticToken)
            })
            propName =
                this.SUBRULE(this.PropertyName)

            this.OPTION3(() => {
                typeAnnoOrCallSig =
                    this.OR([
                        {ALT: () => this.SUBRULE(this.TypeAnnotation)},
                        {ALT: () => this.SUBRULE(this.CallSignature)},
                    ], "TypeAnnotation or CallSignature")
            })
            semicolon =
                this.CONSUME(Semicolon)

            return PT(AmbientPropertyMemberDeclaration,
                CHILDREN(accessMod, staticTok, propName, typeAnnoOrCallSig,
                    SYNTAX_BOX([staticTok, semicolon])))
        })


        // AmbientModuleDeclaration:
        //    'module' IdentifierPath '{' AmbientModuleBody '}'
        public AmbientModuleDeclaration = this.RULE("AmbientModuleDeclaration", () => {
            let moduleTok, qn, lCurly, body = undefined, rCurly

            moduleTok =
                this.CONSUME(ModuleToken)
            qn =
                this.SUBRULE(this.QualifiedName)
            lCurly =
                this.CONSUME(LCurly)

            this.OPTION(() => {
                body =
                    this.SUBRULE(this.AmbientModuleBody)
            })
            rCurly =
                this.CONSUME(RCurly)

            return PT(AmbientModuleDeclaration,
                CHILDREN(qn, body,
                    SYNTAX_BOX([moduleTok, lCurly, rCurly])))
        })


        // AmbientModuleBody:
        //    AmbientModuleElements?
        //
        // AmbientModuleElements:
        //    AmbientModuleElement
        //    AmbientModuleElements AmbientModuleElement
        public AmbientModuleBody = this.RULE("AmbientModuleBody", () => {
            let elements = []

            this.MANY(() => {
                this.SUBRULE(this.AmbientModuleElement)
            })

            return PT(AmbientModuleBody,
                CHILDREN(elements))
        })


        // AmbientModuleElement:
        //    export? AmbientVariableDeclaration
        //    export? AmbientFunctionDeclaration
        //    export? AmbientClassDeclaration
        //    export? InterfaceDeclaration
        //    export? AmbientEnumDeclaration
        //    export? AmbientModuleDeclaration
        //    export? ImportDeclaration
        public AmbientModuleElement = this.RULE("AmbientModuleElement", () => {
            let exportTok = undefined, element

            this.OPTION(() => {
                exportTok =
                    this.CONSUME(ExportToken)
            })

            element =
                this.OR([
                    {ALT: () =>  this.SUBRULE(this.AmbientVariableDeclaration)},
                    {ALT: () =>  this.SUBRULE(this.AmbientFunctionDeclaration)},
                    {ALT: () =>  this.SUBRULE(this.AmbientClassDeclaration)},
                    {ALT: () =>  this.SUBRULE(this.InterfaceDeclaration)},
                    {ALT: () =>  this.SUBRULE(this.AmbientEnumDeclaration)},
                    {ALT: () =>  this.SUBRULE(this.AmbientModuleDeclaration)},
                    {ALT: () =>  this.SUBRULE(this.ImportDeclaration)}
                ], "an AmbientModuleElement")

            return PT(AmbientModuleElement,
                CHILDREN(element,
                    SYNTAX_BOX([exportTok])))
        })


        // AmbientExternalModuleDeclaration:
        //    'declare' 'module' StringLiteral '{' AmbientExternalModuleBody '}'
        //public AmbientExternalModuleDeclaration = this.RULE("AmbientExternalModuleDeclaration", () => {
        //    this.CONSUME(DeclareToken)
        //    this.CONSUME(ModuleToken)
        //    this.CONSUME(StringLiteral)
        //    this.CONSUME(LCurly)
        //    this.SUBRULE(this.AmbientExternalModuleBody)
        //    this.CONSUME(RCurly)
        //})


        // AmbientExternalModuleBody:
        //    AmbientExternalModuleElements?
        //
        // AmbientExternalModuleElements:
        //    AmbientExternalModuleElement
        //    AmbientExternalModuleElements AmbientExternalModuleElement
        //
        // AmbientExternalModuleElement:
        //    AmbientModuleElement
        //    ExportAssignment
        //    export? ExternalImportDeclaration
        //public AmbientExternalModuleBody = this.RULE("AmbientExternalModuleBody", () => {
        //    // @formatter:off
        //    // TODO: missing repetition
        //    this.OR([
        //        {WHEN: isAmbientModuleElement, THEN_DO: () =>  this.SUBRULE(this.AmbientModuleElement)},
        //        {WHEN: isExportAssignment, THEN_DO:() =>  this.SUBRULE(this.ExportAssignment)},
        //        {WHEN: isExternalImportDeclaration, THEN_DO: () => {
        //            this.OPTION(() => {
        //                this.CONSUME(ExportToken)
        //            })
        //            this.SUBRULE(this.ExternalImportDeclaration)}}
        //    ], "Interface TypeAlias ImportDec AmbientDec or ExternalImportDec")
        //    // @formatter:on
        //})
    }


    function isAmbientModuleKeyword(token) {
        return (token instanceof VarToken ||
        token instanceof FunctionToken ||
        token instanceof InterfaceToken ||
        token instanceof ConstToken ||
        token instanceof EnumToken ||
        token instanceof ClassToken ||
        token instanceof ModuleToken || // TODO 'namespace kw? )
        token instanceof ImportToken)
    }

    function isInterfaceOrTypeOrImportOrDeclare(token) {
        return (token instanceof InterfaceToken ||
        token instanceof TypeToken ||
        token instanceof ImportToken ||
        token instanceof DeclareToken)
    }


    //function isAmbientModuleElement():boolean {
    //    let la1 = this.LA(1)
    //    let la2 = this.LA(2)
    //    return isAmbientModuleKeyword(la1) ||
    //        la1 instanceof ExportToken && isAmbientModuleKeyword(la2)
    //}


    function isExportAssignment():boolean {
        let la1 = this.LA(1)
        let la2 = this.LA(2)
        return la1 instanceof ExportToken && la2 instanceof Equals
    }


    //function isAmbientExternalModuleDeclaration():boolean {
    //    let la1 = this.LA(1)
    //    let la2 = this.LA(2)
    //    return la1 instanceof DeclareToken && la2 instanceof ModuleToken
    //}


    // TODO: verify this
    function isOtherDeclarationElement():boolean {
        let la1 = this.LA(1)
        let la2 = this.LA(2)
        return (isAmbientModuleKeyword(la1) || isInterfaceOrTypeOrImportOrDeclare(la1)) ||
            (la1 instanceof ExportToken && (isAmbientModuleKeyword(la2)) || isInterfaceOrTypeOrImportOrDeclare(la2))
    }


    //function isExternalImportDeclaration():boolean {
    //    let la1 = this.LA(1)
    //    let la2 = this.LA(2)
    //    return la1 instanceof ExportToken && la2 instanceof ImportToken
    //}
}
