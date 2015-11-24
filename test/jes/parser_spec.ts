namespace jes.parser.spec {

    const expect = chai.expect
    import JsonLexer = jes.lexer.JsonLexer

    describe("The Json Parser", () => {

        it("can lex & parse a simple Json - sanity test", () => {

            let inputText = "{ \"arr\": [1,2,3], \"obj\": {\"num\":666}}";
            let lexResult = JsonLexer.tokenize(inputText);
            expect(lexResult.errors).to.be.empty

            let parser = new JsonParser(lexResult.tokens);
            parser.object();
            expect(parser.errors).to.be.empty;
        })

    });
}

