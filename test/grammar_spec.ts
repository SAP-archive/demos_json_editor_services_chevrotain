namespace jes.grammar.spec {

    const expect = chai.expect

    describe("The Grammar namespace", () => {

        it("exposes a Json Lexer + Parser", () => {
            let lexResult = jsonLexer.tokenize("{\"name\":\"bamba\", \"age\":5}")
            let parser = new JsonParser(lexResult.tokens)

            parser.object()
            expect(parser.errors).to.be.empty
        })
    })
}
