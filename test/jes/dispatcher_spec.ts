namespace jes.dispatcher.spec {

    import BaseJsonDispatcher = jes.ast.dispatcher.BaseJsonDispatcher;
    import AstNode = pudu.ast.AstNode;
    import ObjectNode = jes.ast.ObjectNode;
    import ObjectItemNode = jes.ast.ObjectItemNode;
    import ArrayNode = jes.ast.ArrayNode;
    import NumberNode = jes.ast.NumberNode;

    const expect = chai.expect

    describe("The jes visitor implementation", () => {
        it("can dispatch for an AstNode - sanity test", () => {
            let dispatcherConstructor = class extends BaseJsonDispatcher<void, string> {

                handleAstNode(node:AstNode):string {
                    throw Error("should not have gotten to this handler when all sample nodes have handlers")
                }

                handleArrayNode(node:ArrayNode):string {
                    return `length: ${node.length}`
                }

                handleNumberNode(node:NumberNode):string {
                    return node.value
                }
            }

            let dispatcher = new dispatcherConstructor()

            let sixes = new NumberNode("666")
            let threes = new NumberNode("333")
            let arr = new ArrayNode([sixes, threes])

            let expectedResult = ["length: 2", "666", "333"]
            let actualResult = arr.visit(dispatcher)

            expect(actualResult).to.contain.members(expectedResult)
            expect(expectedResult).to.contain.members(actualResult)
            expect(actualResult.length).to.equal(expectedResult.length)
        })
    })
}