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
    export class LSquare extends Token { static PATTERN = /\[/}
    export class RSquare extends Token { static PATTERN = /]/}
    export class Comma extends Token { static PATTERN = /,/}
    export class Colon extends Token { static PATTERN = /:/}
    export class Equals extends Token { static PATTERN = /=/}
    export class Semicolon extends Token { static PATTERN = /;/}

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

        public TypeAliasDeclaration = this.RULE("TypeAliasDeclaration", () => {
            this.CONSUME(Type)
            this.CONSUME(Identifier)
            this.CONSUME(Equals)
            this.SUBRULE(this.Type)
            this.CONSUME(Equals) // TODO: is this optional?
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
            this.SUBRULE(this.qualifiedName);
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
            this.SUBRULE(this.qualifiedName)
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


        // replaces entityName and IdentifierPath
        public qualifiedName = this.RULE("qualifiedName", () => {
            this.AT_LEAST_ONE_SEP(Comma, () => {
                this.CONSUME(Identifier)
            }, "identifier")
        })


        // types
        public Type = this.RULE("Type", () => {
            // TODO impel
        })


        public CallSignature = this.RULE("CallSignature", () => {
            // TODO impel
        })


        public PropertyName = this.RULE("PropertyName", () => {
            // TODO impel
        })


        public ParameterList = this.RULE("ParameterList", () => {
            // TODO impel
        })


        public AccessibilityModifier = this.RULE("AccessibilityModifier", () => {
            // TODO impel
        })


        public TypeAnnotation = this.RULE("TypeAnnotation", () => {
            // TODO impel
        })


        public IndexSignature = this.RULE("IndexSignature", () => {
            // TODO impel
        })


        public TypeParameters = this.RULE("TypeParameters", () => {
            // TODO impel
        })

        public TypeReference = this.RULE("TypeReference", () => {
            // TODO impel
        })

        public ObjectType = this.RULE("ObjectType", () => {
            // TODO impel
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


