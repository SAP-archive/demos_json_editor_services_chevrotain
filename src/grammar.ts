namespace jes.grammar {

    import Token = chevrotain.Token
    import Lexer = chevrotain.Lexer

    // ----------------- Lexer -----------------

    // keywords
    export class Keyword extends Token { static PATTERN = Lexer.NA}
    export class Export extends Keyword { static PATTERN = /export/}
    export class Declare extends Keyword { static PATTERN = /declare/}
    export class Module extends Keyword { static PATTERN = /module/} // TODO: what about namespace kw?
    export class FunctionKW extends Keyword { static PATTERN = /Function/}
    export class Class extends Keyword { static PATTERN = /class/}
    export class Constructor extends Keyword { static PATTERN = /Constructor/}
    export class Static extends Keyword { static PATTERN = /static/}
    export class Extends extends Keyword { static PATTERN = /extends/}
    export class Interface extends Keyword { static PATTERN = /interface/}
    export class Enum extends Keyword { static PATTERN = /enum/}
    export class Const extends Keyword { static PATTERN = /const/}
    export class Import extends Keyword { static PATTERN = /Import/}
    export class Type extends Keyword { static PATTERN = /type/}
    export class Require extends Keyword { static PATTERN = /require/}
    export class Var extends Keyword { static PATTERN = /var/}
    export class AnyKW extends Keyword { static PATTERN = /any/}
    export class NumberKW extends Keyword { static PATTERN = /number/}
    export class BooleanKW extends Keyword { static PATTERN = /boolean/}
    export class StringKW extends Keyword { static PATTERN = /string/}
    export class VoidKW extends Keyword { static PATTERN = /void/}
    export class NewKW extends Keyword { static PATTERN = /new/}
    export class TypeofKW extends Keyword { static PATTERN = /typeof/}
    export class PrivateKW extends Keyword { static PATTERN = /private/}
    export class PublicKW extends Keyword { static PATTERN = /public]/}
    export class ProtectedKW extends Keyword { static PATTERN = /protected/}
    export class TypeKW extends Keyword { static PATTERN = /type/}


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


        public DeclarationSourceFile = this.RULE("DeclarationSourceFile", () => {
            this.MANY(() => {
                this.SUBRULE(this.DeclarationElement)
            })
        })


        public DeclarationElement = this.RULE("DeclarationElement", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.ExportAssignment)},
                {ALT: () =>  this.SUBRULE(this.AmbientExternalModuleDeclaration)},
                {ALT: () => {
                    this.OPTION(() => {
                        this.CONSUME(Export)
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


        public ExportAssignment = this.RULE("ExportAssignment", () => {
            this.CONSUME(Export)
            this.CONSUME(Equals)
            this.CONSUME(Identifier)
            this.CONSUME(Semicolon) // TODO: is this optional?
        })


        public AmbientExternalModuleDeclaration = this.RULE("AmbientExternalModuleDeclaration", () => {
            this.CONSUME(Declare)
            this.CONSUME(Module)
            this.CONSUME(StringLiteral)
            this.CONSUME(LCurly)
            this.SUBRULE(this.AmbientExternalModuleBody)
            this.CONSUME(RCurly)
        })


        public AmbientExternalModuleBody = this.RULE("AmbientExternalModuleBody", () => {
            // @formatter:off
            this.OR([
                {WHEN: isAmbientModuleElement, THEN_DO: () =>  this.SUBRULE(this.AmbientModuleElement)},
                {WHEN: isExportAssignment, THEN_DO:() =>  this.SUBRULE(this.ExportAssignment)},
                {WHEN: isExternalImportDeclaration, THEN_DO: () => {
                    this.OPTION(() => {
                        this.CONSUME(Export)
                    })
                    this.SUBRULE(this.ExternalImportDeclaration)}}
            ], "Interface TypeAlias ImportDec AmbientDec or ExternalImportDec")
            // @formatter:on
        })


        public AmbientModuleElement = this.RULE("AmbientModuleElement", () => {
            this.OPTION(() => {
                this.CONSUME(Export)
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


        public AmbientVariableDeclaration = this.RULE("AmbientFunctionDeclaration", () => {
            this.CONSUME(Var)
            this.CONSUME(Identifier)
            this.OPTION(() => {
                this.SUBRULE(this.TypeAnnotation)
            })
            this.CONSUME(Semicolon) // TODO: is this optional?
        })


        public AmbientFunctionDeclaration = this.RULE("AmbientFunctionDeclaration", () => {
            this.CONSUME(FunctionKW)
            this.CONSUME(Identifier)
            this.SUBRULE(this.CallSignature)
            this.CONSUME(Semicolon) // TODO: is this optional?
        })


        public AmbientClassDeclaration = this.RULE("AmbientClassDeclaration", () => {
            this.CONSUME(Class)
            this.CONSUME(Identifier)
            this.OPTION(() => {
                this.SUBRULE(this.TypeParameters)
            })
            this.CONSUME(LCurly)
            this.SUBRULE(this.AmbientClassBody)
            this.CONSUME(RCurly)
        })


        public AmbientClassBody = this.RULE("AmbientClassBody", () => {
            this.MANY(() => {
                this.SUBRULE(this.AmbientClassBodyElement)
            })
        })


        public AmbientClassBodyElement = this.RULE("AmbientClassBodyElement", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.AmbientConstructorDeclaration)},
                {ALT: () =>  this.SUBRULE(this.AmbientPropertyMemberDeclaration)},
                {ALT: () =>  this.SUBRULE(this.IndexSignature)},
                ], "an AmbientClassBodyElement")
            // @formatter:on
        })


        public AmbientConstructorDeclaration = this.RULE("AmbientConstructorDeclaration", () => {
            this.CONSUME(Constructor)
            this.CONSUME(LParen)
            this.OPTION(() => {
                this.SUBRULE(this.ParameterList)
            })
            this.CONSUME(RParen)
            this.CONSUME(Semicolon) // TODO: is this optional?
        })


        public AmbientPropertyMemberDeclaration = this.RULE("AmbientPropertyMemberDeclaration", () => {
            this.OPTION(() => {
                this.SUBRULE(this.AccessibilityModifier)
            })

            this.OPTION(() => {
                this.CONSUME(Static)
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
        })


        public InterfaceDeclaration = this.RULE("InterfaceDeclaration", () => {
            this.CONSUME(Interface)
            this.CONSUME(Identifier)
            this.OPTION(() => {
                this.SUBRULE(this.TypeParameters)
            })
            this.OPTION(() => {
                this.SUBRULE(this.InterfaceExtendsClause)
            })
            this.SUBRULE(this.ObjectType)
        })


        public InterfaceExtendsClause = this.RULE("InterfaceExtendsClause", () => {
            this.CONSUME(Extends)

            // ClassOrInterfaceTypeList, ClassOrInterfaceType:
            this.MANY(() => {
                this.SUBRULE(this.TypeReference)
            })
        })

        // in-lined EnumDeclaration
        public AmbientEnumDeclaration = this.RULE("AmbientEnumDeclaration", () => {
            this.OPTION(() => {
                this.CONSUME(Const)
            })
            this.CONSUME(Enum)
            this.CONSUME(Identifier)
            this.CONSUME(LCurly)
            this.OPTION(() => {
                this.SUBRULE(this.EnumBody)
            })
            this.CONSUME(RCurly)
        })


        public EnumBody = this.RULE("EnumBody", () => {
            this.MANY(() => {
                this.SUBRULE(this.EnumMember)
            })
        })


        public EnumMember = this.RULE("EnumMember", () => {
            this.SUBRULE(this.PropertyName)
            // DIFF: no ENUM = EnumValue, maybe support simple expressions?
        })


        public AmbientModuleDeclaration = this.RULE("AmbientModuleDeclaration", () => {
            this.CONSUME(Module)
            this.SUBRULE(this.QualifiedName);
            this.CONSUME(LCurly)
            this.OPTION(() => {
                this.SUBRULE(this.AmbientModuleBody)
            })
            this.CONSUME(RCurly)
        })


        public AmbientModuleBody = this.RULE("AmbientModuleBody", () => {
            this.MANY(() => {
                this.SUBRULE(this.AmbientModuleElement)
            })
        })


        public ImportDeclaration = this.RULE("ImportDeclaration", () => {
            this.CONSUME(Import)
            this.CONSUME(Identifier)
            this.CONSUME(Equals)
            this.SUBRULE(this.QualifiedName)
            this.CONSUME(Semicolon) // TODO: is this optional?
        })


        public AmbientDeclaration = this.RULE("AmbientDeclaration", () => {
            this.CONSUME(Declare)
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


        public ExternalImportDeclaration = this.RULE("ExternalImportDeclaration", () => {
            this.CONSUME(Import)
            this.CONSUME(Identifier)
            this.CONSUME(Equals)
            this.SUBRULE(this.ExternalModuleReference)
            this.CONSUME(Semicolon) // TODO: is this optional?
        })

        public ExternalModuleReference = this.RULE("ExternalModuleReference", () => {
            this.CONSUME(Require)
            this.CONSUME(LParen)
            this.CONSUME(StringLiteral)
            this.CONSUME(RParen) // TODO: is this optional?
        })


        // replaces entityName, IdentifierPath and TypeName
        public QualifiedName = this.RULE("qualifiedName", () => {
            this.AT_LEAST_ONE_SEP(Dot, () => {
                this.CONSUME(Identifier)
            }, "identifier")
        })


        // types
        public TypeParameters = this.RULE("TypeParameters", () => {
            this.CONSUME(LChevron)
            this.MANY(() => {
                this.SUBRULE(this.TypeParameter)
            })
            this.CONSUME(RChevron)
        })


        public TypeParameter = this.RULE("TypeParameter", () => {
            this.CONSUME(Identifier)
            this.OPTION(() => {
                this.SUBRULE(this.Constraint)
            })
        })


        public Constraint = this.RULE("Constraint", () => {
            this.CONSUME(Identifier)
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


        // this is also TypeArgument
        public Type = this.RULE("Type", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.PrimaryOrUnionType)},
                {ALT: () =>  this.SUBRULE(this.FunctionType)},
                {ALT: () =>  this.SUBRULE(this.ConstructorType)},
                ], "a Type")
            // @formatter:on
        })


        public PrimaryOrUnionType = this.RULE("PrimaryOrUnionType", () => {
            this.AT_LEAST_ONE_SEP(Pipe, () => {
                this.SUBRULE(this.Type)
            }, "A Type")
        })


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


        public ParenthesizedType = this.RULE("ParenthesizedType", () => {
            this.CONSUME(LParen)
            this.SUBRULE(this.Type)
            this.CONSUME(RParen)
        })


        public PredefinedType = this.RULE("PredefinedType", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.CONSUME(AnyKW)},
                {ALT: () =>  this.CONSUME(NumberKW)},
                {ALT: () =>  this.CONSUME(BooleanKW)},
                {ALT: () =>  this.CONSUME(StringKW)},
                {ALT: () =>  this.CONSUME(VoidKW)},
                ], "a predefined type")
            // @formatter:on
        })


        public TypeReference = this.RULE("TypeReference", () => {
            this.SUBRULE(this.QualifiedName)
            // [no LineTerminator here]
            this.OPTION(() => {
                this.SUBRULE(this.TypeArguments)
            })
        })


        public ObjectType = this.RULE("ObjectType", () => {
            this.CONSUME(LCurly)
            this.OPTION(() => {
                this.SUBRULE(this.TypeBody)
            })
            this.CONSUME(RCurly)
        })


        public TypeBody = this.RULE("TypeBody", () => {
            this.MANY_SEP(Semicolon, () => {
                this.SUBRULE(this.TypeMember)
            })

            this.OPTION(() => {
                this.CONSUME(Semicolon)
            })
        })


        public TypeMember = this.RULE("TypeMember", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.SUBRULE(this.PropertySignature)},
                {ALT: () =>  this.SUBRULE(this.CallSignature)},
                {ALT: () =>  this.SUBRULE(this.ConstructSignature)},
                {ALT: () =>  this.SUBRULE(this.IndexSignature)},
                // DIFF - not implemented yet as it has same prefix as PropertySignature
                //{ALT: () =>  this.SUBRULE(this.MethodSignature)},
                ], "a TypeMember")
            // @formatter:on
        })


        public ArrayType = this.RULE("ArrayType", () => {
            this.SUBRULE(this.PrimaryType)
            // [no LineTerminator here]
            this.CONSUME(LSquare)
            this.CONSUME(RSquare)
        })


        public TupleType = this.RULE("TupleType", () => {
            this.CONSUME(LSquare)
            this.MANY(() => {
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
        //    'new' ConstructorType? '(' ConstructorType? ')' '=>' Type
        public ConstructorType = this.RULE("ConstructorType", () => {
            this.CONSUME(NewKW)
            this.SUBRULE(this.FunctionType)
        })


        // TypeQuery:
        //    'typeof' TypeQueryExpression
        public TypeQuery = this.RULE("TypeQuery", () => {
            this.CONSUME(TypeofKW)
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
        //    IdentifierName |
        //    StringLiteral  |
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
            this.CONSUME(NewKW)
            this.SUBRULE(this.CallSignature)
        })


        // AccessibilityModifier:
        //    'public'
        //    'private'
        //    'protected'
        public AccessibilityModifier = this.RULE("AccessibilityModifier", () => {
            // @formatter:off
            this.OR([
                {ALT: () =>  this.CONSUME(PublicKW)},
                {ALT: () =>  this.CONSUME(PrivateKW)},
                {ALT: () =>  this.CONSUME(ProtectedKW)}
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
                {ALT: () =>  this.CONSUME(StringKW)},
                {ALT: () =>  this.CONSUME(NumberKW)}
                ], "an accessibility Modifier")
            // @formatter:on
            this.CONSUME(RSquare)
            this.SUBRULE(this.TypeAnnotation)
        })


        // TypeAliasDeclaration:
        //    'type' Identifier '=' Type ';'
        public TypeAliasDeclaration = this.RULE("TypeAliasDeclaration", () => {
            this.CONSUME(TypeKW)
            this.CONSUME(Identifier)
            this.CONSUME(Equals)
            this.SUBRULE(this.Type)
            this.CONSUME(Semicolon)
        })


        public TypeAnnotation = this.RULE("TypeAnnotation", () => {
            this.CONSUME(Colon)
            this.SUBRULE(this.Type)
        })
    }


    function isAmbientModuleKeyword(token) {
        return (token instanceof Var ||
        token instanceof FunctionKW ||
        token instanceof Interface ||
        token instanceof Const ||
        token instanceof Enum ||
        token instanceof Module || // TODO 'namespace kw? )
        token instanceof Import)
    }

    function isAmbientModuleElement():boolean {
        let la1 = this.LA(1)
        let la2 = this.LA(2)
        return isAmbientModuleKeyword(la1) ||
            la1 instanceof Export && isAmbientModuleKeyword(la2)
    }

    function isExportAssignment():boolean {
        let la1 = this.LA(1)
        let la2 = this.LA(2)
        return la1 instanceof Export && la2 instanceof Equals
    }

    function isExternalImportDeclaration():boolean {
        let la1 = this.LA(1)
        let la2 = this.LA(2)
        return la1 instanceof Export && la2 instanceof Import
    }

}


