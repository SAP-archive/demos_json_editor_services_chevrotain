namespace jes.parser {

    import Token = chevrotain.Token
    import PT = pudu.parseTree.PT

    import Parser = chevrotain.Parser
    import LCurly = jes.lexer.LCurly;
    import Comma = jes.lexer.Comma;
    import RCurly = jes.lexer.RCurly;
    import StringLiteral = jes.lexer.StringLiteral;
    import Colon = jes.lexer.Colon;
    import LSquare = jes.lexer.LSquare;
    import RSquare = jes.lexer.RSquare;
    import NumberLiteral = jes.lexer.NumberLiteral;
    import True = jes.lexer.True;
    import False = jes.lexer.False;
    import Null = jes.lexer.Null;

    export class JsonParser extends Parser {

        constructor(input:Token[]) {
            super(input, jes.lexer.allTokens)
            Parser.performSelfAnalysis(this)
        }

        public object = this.RULE("object", () => {
            this.CONSUME(LCurly);
            this.OPTION(() => {
                this.SUBRULE(this.objectItem);
                this.MANY(() => {
                    this.CONSUME(Comma);
                    this.SUBRULE2(this.objectItem);
                });
            });
            this.CONSUME(RCurly);
        });

        public objectItem = this.RULE("objectItem", () => {
            this.CONSUME(StringLiteral);
            this.CONSUME(Colon);
            this.SUBRULE(this.value);
        });

        public array = this.RULE("array", () => {
            this.CONSUME(LSquare);
            this.OPTION(() => {
                this.SUBRULE(this.value);
                this.MANY(() => {
                    this.CONSUME(Comma);
                    this.SUBRULE2(this.value);
                });
            });
            this.CONSUME(RSquare);
        });

        public value = this.RULE("value", () => {
            this.OR([
                {ALT: () => { this.CONSUME(StringLiteral) }},
                {ALT: () => { this.CONSUME(NumberLiteral) }},
                {ALT: () => { this.SUBRULE(this.object) }},
                {ALT: () => { this.SUBRULE(this.array) }},
                {ALT: () => { this.CONSUME(True) }},
                {ALT: () => { this.CONSUME(False) }},
                {ALT: () => { this.CONSUME(Null) }}
            ], "a value");
        });

    }

}
