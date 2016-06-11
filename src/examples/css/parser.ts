import {Parser} from "chevrotain"
import {
    cssTokens,
    CharsetSym,
    SemiColon,
    Cdo,
    ImportSym,
    Cdc,
    Uri,
    MediaSym,
    Ident,
    PageSym,
    Minus,
    Plus,
    Hash,
    Star,
    Equals,
    Includes,
    Dasmatch,
    RSquare,
    Func,
    RParen,
    ImportantSym,
    Num,
    Percentage,
    Length,
    Ems,
    Exs,
    Angle,
    Time,
    Freq,
    Slash,
    GreaterThan,
    StringLiteral,
    LCurly,
    RCurly,
    Comma,
    Colon,
    LSquare,
    Dot
} from "./lexer"

export class CssParser extends Parser {

    constructor(input) {
        super(input, cssTokens)
        Parser.performSelfAnalysis(this)
    }

    stylesheet = this.RULE("stylesheet", () => {

        // [ CHARSET_SYM STRING "" ]?
        this.OPTION(() => {
            this.SUBRULE(this.charsetHeader)
        })

        // [S|CDO|CDC]*
        this.SUBRULE(this.cdcCdo)

        // [ import [ CDO S* | CDC S* ]* ]*
        this.MANY(() => {
            this.SUBRULE(this.cssImport)
            this.SUBRULE2(this.cdcCdo)
        })

        // [ [ ruleset | media | page ] [ CDO S* | CDC S* ]* ]*
        this.MANY2(() => {
            this.SUBRULE(this.contents)
        })
    })

    charsetHeader = this.RULE("charsetHeader", () => {
        this.CONSUME(CharsetSym)
        this.CONSUME(StringLiteral)
        this.CONSUME(SemiColon)
    })

    contents = this.RULE("contents", () => {
        // @formatter:off
            this.OR([
                {ALT: () => { this.SUBRULE(this.ruleset)}},
                {ALT: () => { this.SUBRULE(this.media)}},
                {ALT: () => { this.SUBRULE(this.page)}}
            ])
            // @formatter:on
        this.SUBRULE3(this.cdcCdo)
    })

    // factor out repeating pattern for cdc/cdo
    cdcCdo = this.RULE("cdcCdo", () => {
        // @formatter:off
            this.MANY(function () {
                this.OR([
                    {ALT: () => { this.CONSUME(Cdo)}},
                    {ALT: () => { this.CONSUME(Cdc)}}
                ])
            })
            // @formatter:on
    })

    // IMPORT_SYM S*
    // [STRING|URI] S* media_list? "" S*
    cssImport = this.RULE("cssImport", () => {
        this.CONSUME(ImportSym)
        // @formatter:off
            this.OR([
                {ALT: () => { this.CONSUME(StringLiteral)}},
                {ALT: () => { this.CONSUME(Uri)}}
            ])
            // @formatter:on

        this.OPTION(() => {
            this.SUBRULE(this.media_list)
        })

        this.CONSUME(SemiColon)
    })

    // MEDIA_SYM S* media_list "{" S* ruleset* "}" S*
    media = this.RULE("media", () => {
        this.CONSUME(MediaSym)
        this.SUBRULE(this.media_list)
        this.CONSUME(LCurly)
        this.SUBRULE(this.ruleset)
        this.CONSUME(RCurly)
    })

    // medium [ COMMA S* medium]*
    media_list = this.RULE("media_list", () => {
        this.MANY_SEP(Comma, () => {
            this.SUBRULE(this.medium)
        })
    })

    // IDENT S*
    medium = this.RULE("medium", () => {
        this.CONSUME(Ident)
    })

    // PAGE_SYM S* pseudo_page?
    // "{" S* declaration? [ "" S* declaration? ]* "}" S*
    page = this.RULE("page", () => {
        this.CONSUME(PageSym)
        this.OPTION(() => {
            this.SUBRULE(this.pseudo_page)
        })

        this.SUBRULE(this.declarationsGroup)
    })

    // "{" S* declaration? [ "" S* declaration? ]* "}" S*
    // factored out repeating grammar pattern
    declarationsGroup = this.RULE("declarationsGroup", () => {
        this.CONSUME(LCurly)
        this.OPTION(() => {
            this.SUBRULE(this.declaration)
        })

        this.MANY(() => {
            this.CONSUME(SemiColon)
            this.OPTION2(() => {
                this.SUBRULE2(this.declaration)
            })
        })
        this.CONSUME(RCurly)
    })

    // ":" IDENT S*
    pseudo_page = this.RULE("pseudo_page", () => {
        this.CONSUME(Colon)
        this.CONSUME(Ident)
    })

    // "/" S* | "," S*
    operator = this.RULE("operator", () => {
        // @formatter:off
            this.OR([
                {ALT: () => { this.CONSUME(Slash)}},
                {ALT: () => { this.CONSUME(Comma)}}
            ])
            // @formatter:on
    })

    // "+" S* | ">" S*
    combinator = this.RULE("combinator", () => {
        // @formatter:off
            this.OR([
                {ALT: () => { this.CONSUME(Plus)}},
                {ALT: () => { this.CONSUME(GreaterThan)}}
            ])
            // @formatter:on
    })

    // "-" | "+"
    unary_operator = this.RULE("unary_operator", () => {
        // @formatter:off
            this.OR([
                {ALT: () => { this.CONSUME(Minus)}},
                {ALT: () => { this.CONSUME(Plus)}}
            ])
            // @formatter:on
    })

    // IDENT S*
    property = this.RULE("property", () => {
        this.CONSUME(Ident)
    })

    // selector [ "," S* selector ]*
    // "{" S* declaration? [ "" S* declaration? ]* "}" S*
    ruleset = this.RULE("ruleset", () => {
        this.MANY_SEP(Comma, () => {
            this.SUBRULE(this.selector)
        })

        this.SUBRULE(this.declarationsGroup)
    })

    // simple_selector [ combinator selector | S+ [ combinator? selector ]? ]?
    selector = this.RULE("selector", () => {
        this.SUBRULE(this.simple_selector)
        this.OPTION(() => {
            this.OPTION2(() => {
                this.SUBRULE(this.combinator)
            })
            this.SUBRULE(this.selector)
        })
    })

    // element_name [ HASH | classSelector | attrib | pseudo ]*
    // | [ HASH | class | attrib | pseudo ]+
    simple_selector = this.RULE("simple_selector", () => {
        // @formatter:off
            this.OR([
                {ALT: () => {
                    this.SUBRULE(this.element_name)
                    this.MANY(() => {
                        this.SUBRULE(this.simple_selector_suffix)
                    })

                }},
                {ALT: () => {
                    this.AT_LEAST_ONE(() => {
                        this.SUBRULE2(this.simple_selector_suffix)
                    }, "selector suffix")
                }}
            ])
            // @formatter:on
    })

    // helper grammar rule to avoid repetition
    // [ HASH | classSelector | attrib | pseudo ]+
    simple_selector_suffix = this.RULE("simple_selector_suffix", () => {
        // @formatter:off
            this.OR([
                {ALT: () => { this.CONSUME(Hash) }},
                {ALT: () => { this.SUBRULE(this.classSelector) }},
                {ALT: () => { this.SUBRULE(this.attrib) }},
                {ALT: () => { this.SUBRULE(this.pseudo) }}
            ])
            // @formatter:off
        })

        // "." IDENT
        classSelector = this.RULE("classSelector", function () {
            this.CONSUME(Dot)
            this.CONSUME(Ident)
        })

        // IDENT | "*"
        element_name = this.RULE("element_name", function () {
            // @formatter:off
            this.OR([
                {ALT: () => { this.CONSUME(Ident) }},
                {ALT: () => { this.CONSUME(Star) }}
            ])
            // @formatter:off
        })

        // "[" S* IDENT S* [ [ "=" | INCLUDES | DASHMATCH ] S* [ IDENT | STRING ] S* ]? "]"
        attrib = this.RULE("attrib", function () {
            this.CONSUME(LSquare)
            this.CONSUME(Ident)

            this.OPTION(() => {
                // @formatter:off
                this.OR([
                    {ALT: () => { this.CONSUME(Equals) }},
                    {ALT: () => { this.CONSUME(Includes) }},
                    {ALT: () => { this.CONSUME(Dasmatch) }}
                ])

                this.OR2([
                    {ALT: () => { this.CONSUME2(Ident) }},
                    {ALT: () => { this.CONSUME(StringLiteral) }}
                ])
                // @formatter:off
            })
            this.CONSUME(RSquare)
        })

        // ":" [ IDENT | FUNCTION S* [IDENT S*]? ")" ]
        pseudo = this.RULE("pseudo", function () {
            this.CONSUME(Colon)
            // @formatter:off
            this.OR([
                {ALT: () => {
                    this.CONSUME(Ident)
                }},
                {ALT: () => {
                    this.CONSUME(Func)
                    this.OPTION(() => {
                        this.CONSUME2(Ident)
                    })
                    this.CONSUME(RParen)
                }}
            ])
            // @formatter:on
        })

    // property ":" S* expr prio?
    declaration = this.RULE("declaration", () => {
        this.SUBRULE(this.property)
        this.CONSUME(Colon)
        this.SUBRULE(this.expr)

        this.OPTION(() => {
            this.SUBRULE(this.prio)
        })
    })

    // IMPORTANT_SYM S*
    prio = this.RULE("prio", () => {
        this.CONSUME(ImportantSym)
    })

    // term [ operator? term ]*
    expr = this.RULE("expr", () => {
        this.SUBRULE(this.term)
        this.MANY(() => {
            this.OPTION(() => {
                this.SUBRULE(this.operator)
            })
            this.SUBRULE2(this.term)
        })
    })

    // unary_operator?
    // [ NUMBER S* | PERCENTAGE S* | LENGTH S* | EMS S* | EXS S* | ANGLE S* |
    // TIME S* | FREQ S* ]
    // | STRING S* | IDENT S* | URI S* | hexcolor | function
    term = this.RULE("term", () => {
        this.OPTION(() => {
            this.SUBRULE(this.unary_operator)
        })

        // @formatter:off
            this.OR([
                {ALT: () => { this.CONSUME(Num) }},
                {ALT: () => { this.CONSUME(Percentage) }},
                {ALT: () => { this.CONSUME(Length) }},
                {ALT: () => { this.CONSUME(Ems) }},
                {ALT: () => { this.CONSUME(Exs) }},
                {ALT: () => { this.CONSUME(Angle) }},
                {ALT: () => { this.CONSUME(Time) }},
                {ALT: () => { this.CONSUME(Freq) }},
                {ALT: () => { this.CONSUME(StringLiteral) }},
                {ALT: () => { this.CONSUME(Ident) }},
                {ALT: () => { this.CONSUME(Uri) }},
                {ALT: () => { this.SUBRULE(this.hexcolor) }},
                {ALT: () => { this.SUBRULE(this.cssFunction) }}
            ])
            // @formatter:on
    })

    // FUNCTION S* expr ")" S*
    cssFunction = this.RULE("cssFunction", () => {
        this.CONSUME(Func)
        this.SUBRULE(this.expr)
        this.CONSUME(RParen)
    })

    hexcolor = this.RULE("hexcolor", () => {
        this.CONSUME(Hash)
    })

}
