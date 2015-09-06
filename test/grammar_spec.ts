namespace jes.grammar.spec {

    const expect = chai.expect

    describe("The Grammar namespace", () => {

        it("exposes a dts Lexer + Parser", () => {
            let lexResult = DTSLexer.tokenize(samples.chai)
            let parser = new DTSParser(lexResult.tokens)

            parser.DeclarationSourceFile()
            expect(parser.errors).to.be.empty
        })
    })
}
