namespace jes.grammar {

    import Token = chevrotain.Token
    import Lexer = chevrotain.Lexer

    // ----------------- Lexer -----------------

    // keywords - using Token suffix to avoid confusion with Typescript keywords/javascript native objects.
    export class Keyword extends Token { static PATTERN = Lexer.NA}
    export class ExportToken extends Keyword { static PATTERN = /export/}
    export class DeclareToken extends Keyword { static PATTERN = /declare/}
    export class ModuleToken extends Keyword { static PATTERN = /module/} // TODO: what about namespace kw?
    export class FunctionToken extends Keyword { static PATTERN = /Function/}
    export class ClassToken extends Keyword { static PATTERN = /class/}
    export class ConstructorToken extends Keyword { static PATTERN = /Constructor/}
    export class StaticToken extends Keyword { static PATTERN = /static/}
    export class ExtendsToken extends Keyword { static PATTERN = /extends/}
    export class ImplementsToken extends Keyword { static PATTERN = /implements/}
    export class InterfaceToken extends Keyword { static PATTERN = /interface/}
    export class EnumToken extends Keyword { static PATTERN = /enum/}
    export class ConstToken extends Keyword { static PATTERN = /const/}
    export class ImportToken extends Keyword { static PATTERN = /Import/}
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


    // DIFF: no support for unicode identifiers
    export class Identifier extends Token { static PATTERN = /\w[\w\d]*/}

    // literals
    export class True extends Token { static PATTERN = /true/}
    export class False extends Token { static PATTERN = /false/}
    export class Null extends Token { static PATTERN = /null/}

    // DIFF - no single quotes strings
    export class StringLiteral extends Token { static PATTERN = /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/ }
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

    // TODO: add all the tokens here! and handle keywords vs identifiers.
    let dtsTokens = [WhiteSpace, NumberLiteral, StringLiteral, RCurly, LCurly,
        LSquare, RSquare, Comma, Colon, True, False, Null]

    export let dtsLexer = new Lexer(dtsTokens, true)


    // ----------------- parser -----------------
    import Parser = chevrotain.Parser

    export class DTSParser extends Parser {

        constructor(input:Token[]) {
            super(input, dtsTokens)
            Parser.performSelfAnalysis(this)
        }



        // DeclarationSourceFile:
        //    DeclarationElements?
        //
        // DeclarationElements:
        //    DeclarationElement
        //    DeclarationElements DeclarationElement
        /**
         * the top level rule
         */
        public DeclarationSourceFile = this.RULE("DeclarationSourceFile", () => {
            this.MANY(() => {
                this.SUBRULE(this.DeclarationElement)
            })
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
        public QualifiedName = this.RULE("qualifiedName", () => {
            this.AT_LEAST_ONE_SEP(Dot, () => {
                this.CONSUME(Identifier)
            }, "identifier")
        })


        // A.1 Types


        // TypeParameters:
        //    '<' TypeParameterList '>'

        // TypeParameterList:
        //    TypeParameter
        //    TypeParameterList ',' TypeParameter
        public TypeParameters = this.RULE("TypeParameters", () => {
            this.CONSUME(LChevron)
            this.AT_LEAST_ONE_SEP(Comma, () => {
                this.SUBRULE(this.TypeParameter)
            }, "A Type Parameter")
            this.CONSUME(RChevron)
        })


        // TypeParameter:
        //    Identifier Constraint?
        public TypeParameter = this.RULE("TypeParameter", () => {
            this.CONSUME(Identifier)
            this.OPTION(() => {
                this.SUBRULE(this.Constraint)
            })
        })


        // Constraint:
        //    'extends' Type
        public Constraint = this.RULE("Constraint", () => {
            this.CONSUME(ExtendsToken)
            this.SUBRULE(this.Type)
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
            this.AT_LEAST_ONE_SEP(Comma, () => {
                this.SUBRULE(this.Type)
            }, "A Type")
        })


        // TypeArgument:
        //    Type
        //
        // Type:
        //    PrimaryOrUnionType
        //    FunctionType
        //    ConstructorType
        public Type = this.RULE("Type", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.PrimaryOrUnionType)},
                {ALT: () =>  this.SUBRULE(this.FunctionType)},
                {ALT: () =>  this.SUBRULE(this.ConstructorType)},
                ], "a Type")
            // @formatter:on
        })


        // PrimaryOrUnionType:
        //    PrimaryType
        //    UnionType

        // UnionType:
        //    PrimaryOrUnionType '|' PrimaryType
        public PrimaryOrUnionType = this.RULE("PrimaryOrUnionType", () => {
            this.AT_LEAST_ONE_SEP(Pipe, () => {
                this.SUBRULE(this.PrimaryType)
            }, "A Type")
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
            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.ParenthesizedType)},
                {ALT: () =>  this.SUBRULE(this.PredefinedType)},
                {ALT: () =>  this.SUBRULE(this.TypeReference)},
                {ALT: () =>  this.SUBRULE(this.ObjectType)},
                {ALT: () =>  this.SUBRULE(this.ArrayType)},
                {ALT: () =>  this.SUBRULE(this.TupleType)},
                {ALT: () =>  this.SUBRULE(this.TypeQuery)}
                ], "a Primary or Union type")
            // @formatter:on
        })


        // ParenthesizedType:
        //    '(' Type ')'
        public ParenthesizedType = this.RULE("ParenthesizedType", () => {
            this.CONSUME(LParen)
            this.SUBRULE(this.Type)
            this.CONSUME(RParen)
        })


        // PredefinedType:
        //    any
        //    number
        //    boolean
        //    string
        //    void
        public PredefinedType = this.RULE("PredefinedType", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.CONSUME(AnyToken)},
                {ALT: () =>  this.CONSUME(NumberToken)},
                {ALT: () =>  this.CONSUME(BooleanToken)},
                {ALT: () =>  this.CONSUME(StringToken)},
                {ALT: () =>  this.CONSUME(VoidToken)},
                ], "a predefined type")
            // @formatter:on
        })


        // TypeReference:
        //    TypeName [no LineTerminator here] TypeArguments?
        public TypeReference = this.RULE("TypeReference", () => {
            this.SUBRULE(this.QualifiedName)
            // [no LineTerminator here] should be implemented as parts of a later checks phase
            this.OPTION(() => {
                this.SUBRULE(this.TypeArguments)
            })
        })


        // ObjectType:
        //    '{' TypeBody? '}'
        public ObjectType = this.RULE("ObjectType", () => {
            this.CONSUME(LCurly)
            this.OPTION(() => {
                this.SUBRULE(this.TypeBody)
            })
            this.CONSUME(RCurly)
        })


        // TypeBody:
        //    TypeMemberList ;?
        //
        // TypeMemberList:
        //    TypeMember
        //    TypeMemberList ';' TypeMember
        public TypeBody = this.RULE("TypeBody", () => {
            this.MANY_SEP(Semicolon, () => {
                this.SUBRULE(this.TypeMember)
            })
            this.OPTION(() => {
                this.CONSUME(Semicolon)
            })
        })


        // TypeMember:
        //    PropertySignature
        //    CallSignature
        //    ConstructSignature
        //    IndexSignature
        //    MethodSignature
        public TypeMember = this.RULE("TypeMember", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.PropertySignature)},
                {ALT: () =>  this.SUBRULE(this.CallSignature)},
                {ALT: () =>  this.SUBRULE(this.ConstructSignature)},
                {ALT: () =>  this.SUBRULE(this.IndexSignature)},
                // DIFF - not implemented yet as it has same prefix as PropertySignature
                //{ALT: () =>  this.SUBRULE(this.MethodSignature)},
                ], "a Type Member")
            // @formatter:on
        })

        // ArrayType:
        //    PrimaryType [no LineTerminator here] '[' ']'
        public ArrayType = this.RULE("ArrayType", () => {
            this.SUBRULE(this.PrimaryType)
            // [no LineTerminator here]
            this.CONSUME(LSquare)
            this.CONSUME(RSquare)
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
            this.CONSUME(LSquare)
            this.MANY_SEP(Comma, () => {
                this.SUBRULE(this.Type)
            })
            this.CONSUME(RSquare)
        })


        // FunctionType:
        //    TypeParameters? ( ParameterList? ) => Type
        public FunctionType = this.RULE("FunctionType", () => {
            this.OPTION(() => {
                this.SUBRULE(this.TypeParameters)
            })
            this.CONSUME(LParen)
            this.OPTION(() => {
                this.SUBRULE(this.ParameterList)
            })
            this.CONSUME(RParen)
            this.CONSUME(FatArrow)
            this.SUBRULE(this.Type)
        })


        // ConstructorType:
        //    'new' TypeParameters? ( ParameterList? ) '=>' Type
        public ConstructorType = this.RULE("ConstructorType", () => {
            this.CONSUME(NewToken)
            this.SUBRULE(this.FunctionType)
        })


        // TypeQuery:
        //    'typeof' TypeQueryExpression
        public TypeQuery = this.RULE("TypeQuery", () => {
            this.CONSUME(TypeofToken)
            this.SUBRULE(this.QualifiedName)
        })


        // PropertySignature:
        //    PropertyName '?'? TypeAnnotation?
        public PropertySignature = this.RULE("PropertySignature", () => {
            this.SUBRULE(this.PropertyName)
            this.OPTION(() => {
                this.CONSUME(Question)
            })
            this.OPTION(() => {
                this.SUBRULE(this.TypeAnnotation)
            })
        })


        //PropertyName:
        //    IdentifierName
        //    StringLiteral
        //    NumericLiteral
        public PropertyName = this.RULE("PropertyName", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.CONSUME(Identifier)},
                {ALT: () =>  this.CONSUME(StringLiteral)},
                {ALT: () =>  this.CONSUME(NumberLiteral)},
                ], "a PropertyName")
            // @formatter:on
        })


        // CallSignature:
        //    TypeParameters? '(' ParameterList? ')' TypeAnnotation?
        public CallSignature = this.RULE("CallSignature", () => {
            this.OPTION(() => {
                this.SUBRULE(this.TypeParameters)
            })
            this.CONSUME(LParen)
            this.OPTION(() => {
                this.SUBRULE(this.ParameterList)
            })
            this.CONSUME(RParen)
            this.OPTION(() => {
                this.SUBRULE(this.TypeAnnotation)
            })
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
            this.AT_LEAST_ONE_SEP(Comma, () => {
                // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.RequiredOrOptionalRestParameter)},
                {ALT: () =>  this.SUBRULE(this.RestParameter)},
                // of optional Param
                ], "a Parameter signature")
            // @formatter:on
            }, "A Parameter signature")
        })


        // RequiredParameter:
        //    AccessibilityModifier? Identifier TypeAnnotation?
        //    Identifier ':' StringLiteral // DIFF this variation is not supported yet

        // OptionalParameter:
        //    AccessibilityModifier? Identifier '?' TypeAnnotation?
        //    AccessibilityModifier? Identifier TypeAnnotation? Initialiser
        //    Identifier ? ':' StringLiteral // DIFF this variation is not supported yet
        public RequiredOrOptionalRestParameter = this.RULE("RequiredOrOptionalParam", () => {
            this.OPTION(() => {
                this.SUBRULE(this.AccessibilityModifier)
            })
            this.CONSUME(Identifier)
            this.OPTION(() => {
                this.CONSUME(Question)
            })
            this.OPTION(() => {
                this.SUBRULE(this.TypeAnnotation)
            })
            // DIFF need to implement initializer with simple values
            //this.OPTION(() => {
            //    this.SUBRULE(this.Initialiser)
            //})
        })


        // RestParameter:
        //    '...' Identifier TypeAnnotation?
        public RestParameter = this.RULE("RestParameter", () => {
            this.CONSUME(DotDotDot)
            this.CONSUME(Identifier)
            this.OPTION(() => {
                this.SUBRULE(this.TypeAnnotation)
            })
        })


        // ConstructSignature:
        //    'new' TypeParameters? '(' ParameterList? ')' TypeAnnotation?
        public ConstructSignature = this.RULE("ConstructSignature", () => {
            this.CONSUME(NewToken)
            this.SUBRULE(this.CallSignature)
        })


        // AccessibilityModifier:
        //    'public'
        //    'private'
        //    'protected'
        public AccessibilityModifier = this.RULE("AccessibilityModifier", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.CONSUME(PublicToken)},
                {ALT: () =>  this.CONSUME(PrivateToken)},
                {ALT: () =>  this.CONSUME(ProtectedToken)}
                ], "an accessibility Modifier")
            // @formatter:on
        })

        //IndexSignature:
        //    '[' Identifier ':' string ']' TypeAnnotation
        //    '[' Identifier ':' number ']' TypeAnnotation
        public IndexSignature = this.RULE("IndexSignature", () => {
            this.CONSUME(LSquare)
            this.CONSUME(Identifier)
            this.CONSUME(Colon)
            // @formatter:off
            this.OR([
                {ALT: () =>  this.CONSUME(StringToken)},
                {ALT: () =>  this.CONSUME(NumberToken)}
                ], "an accessibility Modifier")
            // @formatter:on
            this.CONSUME(RSquare)
            this.SUBRULE(this.TypeAnnotation)
        })


        // TypeAliasDeclaration:
        //    'type' Identifier '=' Type ';'
        public TypeAliasDeclaration = this.RULE("TypeAliasDeclaration", () => {
            this.CONSUME(TypeToken)
            this.CONSUME(Identifier)
            this.CONSUME(Equals)
            this.SUBRULE(this.Type)
            this.CONSUME(Semicolon)
        })


        public TypeAnnotation = this.RULE("TypeAnnotation", () => {
            this.CONSUME(Colon)
            this.SUBRULE(this.Type)
        })


        // A.5 Interfaces


        // InterfaceDeclaration:
        //    'interface' Identifier TypeParameters? InterfaceExtendsClause? ObjectType
        public InterfaceDeclaration = this.RULE("InterfaceDeclaration", () => {
            this.CONSUME(InterfaceToken)
            this.CONSUME(Identifier)
            this.OPTION(() => {
                this.SUBRULE(this.TypeParameters)
            })
            this.OPTION(() => {
                this.SUBRULE(this.InterfaceExtendsClause)
            })
            this.SUBRULE(this.ObjectType)
        })


        // InterfaceExtendsClause:
        //    'extends' ClassOrInterfaceTypeList
        public InterfaceExtendsClause = this.RULE("InterfaceExtendsClause", () => {
            this.CONSUME(ExtendsToken)
            this.SUBRULE(this.ClassOrInterfaceTypeList)
        })


        // ClassOrInterfaceTypeList:
        //    ClassOrInterfaceType
        //    ClassOrInterfaceTypeList , ClassOrInterfaceType
        //
        // ClassOrInterfaceType:
        //    TypeReference
        public ClassOrInterfaceTypeList = this.RULE("ClassOrInterfaceTypeList", () => {
            this.MANY(() => {
                this.SUBRULE(this.TypeReference)
            })
        })


        // A.6 Classes

        // ClassHeritage:
        //    ClassExtendsClause? ImplementsClause?
        public ClassHeritage = this.RULE("ClassHeritage", () => {
            this.OPTION(() => {
                this.SUBRULE(this.ClassExtendsClause)
            })

            this.OPTION(() => {
                this.SUBRULE(this.ImplementsClause)
            })
        })

        // ClassExtendsClause:
        //    'extends' ClassType
        // ClassType:
        //    TypeReference
        public ClassExtendsClause = this.RULE("ClassExtendsClause", () => {
            this.CONSUME(ExtendsToken)
            this.SUBRULE(this.TypeReference)
        })


        // ImplementsClause:
        //    'implements' ClassOrInterfaceTypeList
        public ImplementsClause = this.RULE("ImplementsClause", () => {
            this.CONSUME(ImplementsToken)
            this.SUBRULE(this.ClassOrInterfaceTypeList)
        })


        // EnumDeclaration:
        //    const? 'enum' Identifier '{' EnumBody? '}'
        public EnumDeclaration = this.RULE("EnumDeclaration", () => {
            this.OPTION(() => {
                this.CONSUME(ConstToken)
            })
            this.CONSUME(EnumToken)
            this.CONSUME(Identifier)
            this.CONSUME(LCurly)
            this.OPTION(() => {
                this.SUBRULE(this.EnumBody)
            })
            this.CONSUME(RCurly)
        })


        // EnumBody:
        //    EnumMemberList ','?
        //
        // EnumMemberList:
        //    EnumMember
        //    EnumMemberList ',' EnumMember
        public EnumBody = this.RULE("EnumBody", () => {
            this.MANY_SEP(Comma, () => {
                this.SUBRULE(this.EnumMember)
            })
            this.OPTION(() => {
                this.CONSUME(Comma)
            })
        })


        // EnumMember:
        //    PropertyName
        //    PropertyName '=' EnumValue
        public EnumMember = this.RULE("EnumMember", () => {
            this.SUBRULE(this.PropertyName)
            // DIFF: no <ENUM '=' EnumValue>, maybe support only simple expressions?
        })


        // ImportDeclaration:
        //    'import' Identifier '=' EntityName ';'
        public ImportDeclaration = this.RULE("ImportDeclaration", () => {
            this.CONSUME(ImportToken)
            this.CONSUME(Identifier)
            this.CONSUME(Equals)
            this.SUBRULE(this.QualifiedName) // EntityName
            this.CONSUME(Semicolon)
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
            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.ExportAssignment)},
                {ALT: () =>  this.SUBRULE(this.AmbientExternalModuleDeclaration)},
                {ALT: () => {
                    this.OPTION(() => {
                        this.CONSUME(ExportToken)
                    })
                    this.OR([
                        {ALT: () =>  this.SUBRULE(this.InterfaceDeclaration)},
                        {ALT: () =>  this.SUBRULE(this.TypeAliasDeclaration)},
                        {ALT: () =>  this.SUBRULE(this.ImportDeclaration)},
                        {ALT: () =>  this.SUBRULE(this.AmbientDeclaration)},
                        {ALT: () =>  this.SUBRULE(this.ExternalImportDeclaration)}
                        ], "Interface TypeAlias ImportDec AmbientDec or ExternalImportDec")}}
                ], "a DeclarationElement")
            // @formatter:on
        })


        // ExternalImportDeclaration:
        //    'import' Identifier '=' ExternalModuleReference ';'
        public ExternalImportDeclaration = this.RULE("ExternalImportDeclaration", () => {
            this.CONSUME(ImportToken)
            this.CONSUME(Identifier)
            this.CONSUME(Equals)
            this.SUBRULE(this.ExternalModuleReference)
            this.CONSUME(Semicolon)
        })


        // ExternalModuleReference:
        //    'require' '(' StringLiteral ')'
        public ExternalModuleReference = this.RULE("ExternalModuleReference", () => {
            this.CONSUME(RequireToken)
            this.CONSUME(LParen)
            this.CONSUME(StringLiteral)
            this.CONSUME(RParen)
        })


        // ExportAssignment:
        //    'export' '=' Identifier ';'
        public ExportAssignment = this.RULE("ExportAssignment", () => {
            this.CONSUME(ExportToken)
            this.CONSUME(Equals)
            this.CONSUME(Identifier)
            this.CONSUME(Semicolon)
        })


        // A.10 Ambients


        // AmbientDeclaration:
        //    'declare' AmbientVariableDeclaration
        //    'declare' AmbientFunctionDeclaration
        //    'declare' AmbientClassDeclaration
        //    'declare' AmbientEnumDeclaration
        //    'declare' AmbientModuleDeclaration
        public AmbientDeclaration = this.RULE("AmbientDeclaration", () => {
            this.CONSUME(DeclareToken)
            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.AmbientVariableDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientFunctionDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientClassDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientEnumDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientModuleDeclaration)},
                ], "an AmbientDeclaration")
            // @formatter:on
        })


        // AmbientVariableDeclaration:
        //   'var' Identifier TypeAnnotation? ';'
        public AmbientVariableDeclaration = this.RULE("AmbientVariableDeclaration", () => {
            this.CONSUME(VarToken)
            this.CONSUME(Identifier)
            this.OPTION(() => {
                this.SUBRULE(this.TypeAnnotation)
            })
            this.CONSUME(Semicolon)
        })


        // AmbientFunctionDeclaration:
        //    'function' Identifier CallSignature ';'
        public AmbientFunctionDeclaration = this.RULE("AmbientFunctionDeclaration", () => {
            this.CONSUME(FunctionToken)
            this.CONSUME(Identifier)
            this.SUBRULE(this.CallSignature)
            this.CONSUME(Semicolon)
        })


        // AmbientClassDeclaration:
        //    'class' Identifier TypeParameters? ClassHeritage '{' AmbientClassBody '}'
        public AmbientClassDeclaration = this.RULE("AmbientClassDeclaration", () => {
            this.CONSUME(ClassToken)
            this.CONSUME(Identifier)
            this.OPTION(() => {
                this.SUBRULE(this.TypeParameters)
            })
            this.SUBRULE(this.ClassHeritage)
            this.CONSUME(LCurly)
            this.SUBRULE(this.AmbientClassBody)
            this.CONSUME(RCurly)
        })


        // AmbientClassBody:
        //    AmbientClassBodyElements?
        //
        // AmbientClassBodyElements:
        //    AmbientClassBodyElement
        //    AmbientClassBodyElements AmbientClassBodyElement
        public AmbientClassBody = this.RULE("AmbientClassBody", () => {
            this.MANY(() => {
                this.SUBRULE(this.AmbientClassBodyElement)
            })
        })


        // AmbientClassBodyElement:
        //    AmbientConstructorDeclaration
        //    AmbientPropertyMemberDeclaration
        //    IndexSignature
        public AmbientClassBodyElement = this.RULE("AmbientClassBodyElement", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.AmbientConstructorDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientPropertyMemberDeclaration)},
                {ALT: () =>  this.SUBRULE(this.IndexSignature)},
                ], "an AmbientClassBodyElement")
            // @formatter:on
        })


        // AmbientConstructorDeclaration:
        //    'constructor' '(' ParameterList? ')' ';'
        public AmbientConstructorDeclaration = this.RULE("AmbientConstructorDeclaration", () => {
            this.CONSUME(ConstructorToken)
            this.CONSUME(LParen)
            this.OPTION(() => {
                this.SUBRULE(this.ParameterList)
            })
            this.CONSUME(RParen)
            this.CONSUME(Semicolon)
        })


        // AmbientPropertyMemberDeclaration:
        //    AccessibilityModifier? 'static'? PropertyName TypeAnnotation? ';'
        //    AccessibilityModifier? 'static'? PropertyName CallSignature ';'
        public AmbientPropertyMemberDeclaration = this.RULE("AmbientPropertyMemberDeclaration", () => {
            this.OPTION(() => {
                this.SUBRULE(this.AccessibilityModifier)
            })
            this.OPTION(() => {
                this.CONSUME(StaticToken)
            })
            this.SUBRULE(this.PropertyName)
            this.OPTION(() => {
                // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.TypeAnnotation)},
                {ALT: () =>  this.SUBRULE(this.CallSignature)},
                ], "an AmbientClassBodyElement")
            // @formatter:on
            })
            this.CONSUME(Semicolon)
        })


        // AmbientEnumDeclaration:
        //    EnumDeclaration
        public AmbientEnumDeclaration = this.RULE("AmbientEnumDeclaration", () => {
            this.SUBRULE(this.EnumDeclaration)
        })

        // AmbientModuleDeclaration:
        //    'module' IdentifierPath '{' AmbientModuleBody '}'
        public AmbientModuleDeclaration = this.RULE("AmbientModuleDeclaration", () => {
            this.CONSUME(ModuleToken)
            this.SUBRULE(this.QualifiedName);
            this.CONSUME(LCurly)
            this.OPTION(() => {
                this.SUBRULE(this.AmbientModuleBody)
            })
            this.CONSUME(RCurly)
        })


        // AmbientModuleBody:
        //    AmbientModuleElements?
        //
        // AmbientModuleElements:
        //    AmbientModuleElement
        //    AmbientModuleElements AmbientModuleElement
        public AmbientModuleBody = this.RULE("AmbientModuleBody", () => {
            this.MANY(() => {
                this.SUBRULE(this.AmbientModuleElement)
            })
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
            this.OPTION(() => {
                this.CONSUME(ExportToken)
            })

            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.AmbientVariableDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientFunctionDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientClassDeclaration)},
                {ALT: () =>  this.SUBRULE(this.InterfaceDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientEnumDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientModuleDeclaration)},
                {ALT: () =>  this.SUBRULE(this.ImportDeclaration)}
                ], "an AmbientModuleElement")
            // @formatter:on
        })


        // AmbientExternalModuleDeclaration:
        //    'declare' 'module' StringLiteral '{' AmbientExternalModuleBody '}'
        public AmbientExternalModuleDeclaration = this.RULE("AmbientExternalModuleDeclaration", () => {
            this.CONSUME(DeclareToken)
            this.CONSUME(ModuleToken)
            this.CONSUME(StringLiteral)
            this.CONSUME(LCurly)
            this.SUBRULE(this.AmbientExternalModuleBody)
            this.CONSUME(RCurly)
        })


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
        public AmbientExternalModuleBody = this.RULE("AmbientExternalModuleBody", () => {
            // @formatter:off
            this.OR([
                {WHEN: isAmbientModuleElement, THEN_DO: () =>  this.SUBRULE(this.AmbientModuleElement)},
                {WHEN: isExportAssignment, THEN_DO:() =>  this.SUBRULE(this.ExportAssignment)},
                {WHEN: isExternalImportDeclaration, THEN_DO: () => {
                    this.OPTION(() => {
                        this.CONSUME(ExportToken)
                    })
                    this.SUBRULE(this.ExternalImportDeclaration)}}
            ], "Interface TypeAlias ImportDec AmbientDec or ExternalImportDec")
            // @formatter:on
        })
    }


    function isAmbientModuleKeyword(token) {
        return (token instanceof VarToken ||
        token instanceof FunctionToken ||
        token instanceof InterfaceToken ||
        token instanceof ConstToken ||
        token instanceof EnumToken ||
        token instanceof ModuleToken || // TODO 'namespace kw? )
        token instanceof ImportToken)
    }

    function isAmbientModuleElement():boolean {
        let la1 = this.LA(1)
        let la2 = this.LA(2)
        return isAmbientModuleKeyword(la1) ||
            la1 instanceof ExportToken && isAmbientModuleKeyword(la2)
    }

    function isExportAssignment():boolean {
        let la1 = this.LA(1)
        let la2 = this.LA(2)
        return la1 instanceof ExportToken && la2 instanceof Equals
    }

    function isExternalImportDeclaration():boolean {
        let la1 = this.LA(1)
        let la2 = this.LA(2)
        return la1 instanceof ExportToken && la2 instanceof ImportToken
    }

}


