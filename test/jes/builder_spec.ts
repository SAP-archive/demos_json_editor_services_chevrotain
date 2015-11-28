namespace jes.ast.builder.spec {

    const expect = chai.expect

    import ParseTree = pudu.parseTree.ParseTree
    import PT = pudu.parseTree.PT
    import lexer = jes.lexer
    import parser = jes.parser

    describe("The jes ast builder", () => {

        it("can build a StringNode Ast", () => {
            let ptInput = PT(new lexer.StringLiteral("\"bamba\"", 1, 1, 1, 1, 1))
            let astOutput = buildStringNode(ptInput)
            expect(astOutput).to.be.instanceOf(StringNode)
            expect(astOutput.value).to.equal("bamba")
        })

        it("can build a NumberNode Ast", () => {
            let ptInput = PT(new lexer.NumberLiteral("666", 1, 1, 1, 1, 1))
            let astOutput = buildNumberNode(ptInput)
            expect(astOutput).to.be.instanceOf(NumberNode)
            expect(astOutput.value).to.equal("666")
        })

        it("can build a TrueNode Ast", () => {
            let ptInput = PT(new lexer.TrueLiteral("true", 1, 1, 1, 1, 1))
            let astOutput = buildTrueNode(ptInput)
            expect(astOutput).to.be.instanceOf(TrueNode)
        })

        it("can build a FalseNode Ast", () => {
            let ptInput = PT(new lexer.FalseLiteral("false", 1, 1, 1, 1, 1))
            let astOutput = buildFalseNode(ptInput)
            expect(astOutput).to.be.instanceOf(FalseNode)
        })

        it("can build a NullNode Ast", () => {
            let ptInput = PT(new lexer.NullLiteral("null", 1, 1, 1, 1, 1))
            let astOutput = buildNullNode(ptInput)
            expect(astOutput).to.be.instanceOf(NullNode)
        })

        it("can build an arrayNode Ast", () => {
            let ptInput = PT(parser.ArrayPT,
                [
                    PT(parser.ValuePT, [PT(new lexer.NumberLiteral("123", 1, 1, 1, 1, 1))]),
                    PT(parser.ValuePT, [PT(new lexer.StringLiteral("\"bisli\"", 1, 1, 1, 1, 1))]),
                    PT(parser.ValuePT, [PT(new lexer.NullLiteral("null", 1, 1, 1, 1, 1))]),
                ])

            let astOutput = buildArrayNode(ptInput)
            expect(astOutput).to.be.instanceOf(ArrayNode)
            expect(astOutput.children().length).to.equal(3)
            expect(astOutput.children()[0]).to.be.instanceOf(NumberNode)
            expect(astOutput.children()[1]).to.be.instanceOf(StringNode)
            expect(astOutput.children()[2]).to.be.instanceOf(NullNode)
        })

        it("can build an ObjecItemNode Ast", () => {
            let ptInput = PT(parser.ObjectItemPT,
                [
                    PT(new lexer.StringLiteral("\"key\"", 1, 1, 1, 1, 1)),
                    PT(parser.ValuePT, [PT(new lexer.NumberLiteral("\"value\"", 1, 1, 1, 1, 1))])
                ])

            let astOutput = buildObjectItemNode(ptInput)
            expect(astOutput).to.be.instanceOf(ObjectItemNode)
            expect(astOutput.key).to.be.instanceOf(StringNode)
            expect(astOutput.value).to.be.instanceOf(NumberNode)
        })

        it("can build an ObjectNode Ast", () => {
            let ptInput = PT(parser.ObjectPT,
                [
                    PT(parser.ObjectItemPT,
                        [
                            PT(new lexer.StringLiteral("\"key1\"", 1, 1, 1, 1, 1)),
                            PT(parser.ValuePT, [PT(new lexer.NumberLiteral("\"value\"", 1, 1, 1, 1, 1))])
                        ]),
                    PT(parser.ObjectItemPT,
                        [
                            PT(new lexer.StringLiteral("\"key2\"", 1, 1, 1, 1, 1)),
                            PT(parser.ValuePT, [PT(new lexer.NumberLiteral("\"value\"", 1, 1, 1, 1, 1))])
                        ]),
                    PT(parser.ObjectItemPT,
                        [
                            PT(new lexer.StringLiteral("\"key3\"", 1, 1, 1, 1, 1)),
                            PT(parser.ValuePT, [PT(new lexer.NumberLiteral("\"value\"", 1, 1, 1, 1, 1))])
                        ])
                ])

            let astOutput = buildObjectNode(ptInput)
            expect(astOutput).to.be.instanceOf(ObjectNode)
            expect(astOutput.size).to.equal(3)
            expect(astOutput.children()[0]).to.be.instanceOf(ObjectItemNode)
            expect(astOutput.children()[1]).to.be.instanceOf(ObjectItemNode)
            expect(astOutput.children()[2]).to.be.instanceOf(ObjectItemNode)
        })
    })
}
