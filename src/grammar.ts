namespace jes.grammar {

    import Token = chevrotain.Token
    import Lexer = chevrotain.Lexer

    // ----------------- Lexer -----------------

    export class True extends Token { static PATTERN = /true/}
    export class False extends Token { static PATTERN = /false/}
    export class Null extends Token { static PATTERN = /null/}
    export class LCurly extends Token { static PATTERN = /{/}
    export class RCurly extends Token { static PATTERN = /}/}
    export class LSquare extends Token { static PATTERN = /\[/}
    export class RSquare extends Token { static PATTERN = /]/}
    export class Comma extends Token { static PATTERN = /,/}
    export class Colon extends Token { static PATTERN = /:/}
    export class StringLiteral extends Token { static PATTERN = /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/ }
    export class NumberLiteral extends Token { static PATTERN = /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/}
    export class WhiteSpace extends Token {
        static PATTERN = /\s+/
        static GROUP = Lexer.SKIPPED
    }

    let jsonTokens = [WhiteSpace, NumberLiteral, StringLiteral, RCurly, LCurly,
        LSquare, RSquare, Comma, Colon, True, False, Null]

    export let jsonLexer = new Lexer(jsonTokens, true)


    // ----------------- parser -----------------
    import Parser = chevrotain.Parser

    export class JsonParser extends Parser {
        constructor(input:Token[]) {
            super(input, jsonTokens)
            Parser.performSelfAnalysis(this)
        }


        public object = this.RULE("object", () => {
            let obj = {}

            this.CONSUME(LCurly)
            this.MANY_SEP(Comma, () => {
                _.assign(obj, this.SUBRULE1(this.objectItem))
            })
            this.CONSUME(RCurly)

            return obj
        })


        public objectItem = this.RULE("objectItem", () => {
            let lit, key, value, obj = {}

            lit = this.CONSUME(StringLiteral)
            this.CONSUME(Colon)
            value = this.SUBRULE(this.value)

            // an empty json key is not valid, use "BAD_KEY" instead
            key = lit.isInsertedInRecovery ?
                "BAD_KEY" : lit.image.substr(1, lit.image.length - 2)
            obj[key] = value
            return obj
        })


        public array = this.RULE("array", () => {
            let arr = []
            this.CONSUME(LSquare)
            this.MANY_SEP(Comma, () => {
                arr.push(this.SUBRULE1(this.value))
            })
            this.CONSUME(RSquare)

            return arr
        })


        public value = this.RULE("value", () => {
            // @formatter:off
            return this.OR([
                { ALT: () => {
                        let stringLiteral = this.CONSUME(StringLiteral).image
                        // chop of the quotation marks
                        return stringLiteral.substr(1, stringLiteral.length - 2)
                    }},
                {ALT: () => { return Number(this.CONSUME(NumberLiteral).image) }},
                {ALT: () => { return this.SUBRULE(this.object) }},
                {ALT: () => { return this.SUBRULE(this.array) }},
                {ALT: () => {
                        this.CONSUME(True)
                        return true
                    }},
                {ALT: () => {
                        this.CONSUME(False)
                        return false
                    }},
                {ALT: () => {
                        this.CONSUME(Null)
                        return null
                    }}
            ], "a value")
            // @formatter:on
        })
    }
}
