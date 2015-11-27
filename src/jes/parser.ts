namespace jes.parser {

    import Token = chevrotain.Token

    // not using --module tsc option, so can't use the fancy 'import *'
    import Parser = chevrotain.Parser
    import LCurly = jes.lexer.LCurly
    import Comma = jes.lexer.Comma
    import RCurly = jes.lexer.RCurly
    import StringLiteral = jes.lexer.StringLiteral
    import Colon = jes.lexer.Colon
    import LSquare = jes.lexer.LSquare
    import RSquare = jes.lexer.RSquare
    import NumberLiteral = jes.lexer.NumberLiteral
    import True = jes.lexer.True
    import False = jes.lexer.False
    import Null = jes.lexer.Null

    import ParseTreeToken = pudu.parseTree.ParseTreeToken
    import PT = pudu.parseTree.PT
    import CHILDREN = pudu.parseTree.CHILDREN
    import SYNTAX_BOX = pudu.parseTree.SYNTAX_BOX


    export class ObjectPT extends ParseTreeToken {}
    export class ObjectItemPT extends ParseTreeToken {}
    export class ArrayPT extends ParseTreeToken {}


    export class JsonParser extends Parser {

        constructor(input:Token[]) {
            super(input, jes.lexer.allTokens)
            Parser.performSelfAnalysis(this)
        }

        public object = this.RULE("object", () => {
            let lCurlyTok, rCurlyTok
            let objectItemPTs = [], commas

            lCurlyTok = this.CONSUME(LCurly)
            commas = this.MANY_SEP(Comma, () => {
                objectItemPTs.push(this.SUBRULE2(this.objectItem))
            })
            rCurlyTok = this.CONSUME(RCurly)

            return PT(ObjectPT, CHILDREN(objectItemPTs,
                SYNTAX_BOX([lCurlyTok].concat(commas, [rCurlyTok]))))
        })

        public objectItem = this.RULE("objectItem", () => {
            let stringLiteralTok, colonTok, valuePT

            stringLiteralTok = this.CONSUME(StringLiteral)
            colonTok = this.CONSUME(Colon)
            valuePT = this.SUBRULE(this.value)

            return PT(ObjectItemPT, CHILDREN(stringLiteralTok, valuePT,
                SYNTAX_BOX([colonTok])))
        })

        public array = this.RULE("array", () => {
            let lSquareTok, rSquareTok
            let valuePTs = [], commas

            lSquareTok = this.CONSUME(LSquare)
            commas = this.MANY_SEP(Comma, () => {
                valuePTs.push(this.SUBRULE(this.value))
            })
            rSquareTok = this.CONSUME(RSquare)

            return PT(ArrayPT, CHILDREN(valuePTs,
                SYNTAX_BOX([lSquareTok].concat(commas, [rSquareTok]))))
        })

        public value = this.RULE("value", () => {
            return this.OR([
                {ALT: () => PT(this.CONSUME(StringLiteral))},
                {ALT: () => PT(this.CONSUME(NumberLiteral))},
                {ALT: () => this.SUBRULE(this.object)},
                {ALT: () => this.SUBRULE(this.array)},
                {ALT: () => PT(this.CONSUME(True))},
                {ALT: () => PT(this.CONSUME(False))},
                {ALT: () => PT(this.CONSUME(Null))}
            ], "a value")
        })
    }
}
