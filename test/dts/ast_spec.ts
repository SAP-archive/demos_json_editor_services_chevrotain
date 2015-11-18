namespace jes.ast {

    import AstNode = jes.core.ast.AstNode
    import BaseDTSDispatcher = jes.ast.dispatcher.BaseDTSDispatcher;
    const expect = chai.expect

    describe("The DTS Ast", () => {

        describe("The dts dispatcher implementation", () => {
            it("can dispatch for an AstNode - sanity test", () => {
                let dispatcherConstructor = class extends BaseDTSDispatcher<void, string> {
                    handleIdentifier(node:Identifier):string {
                        return "yey"
                    }
                }

                let dispatcher = new dispatcherConstructor()
                let node = new Identifier("bamba")
                expect(dispatcher.dispatch(node)).to.equal("yey")
            })
        })


        describe("The dts visitor implementation", () => {
            it("can dispatch for an AstNode - sanity test", () => {
                let dispatcherConstructor = class extends BaseDTSDispatcher<void, string> {

                    handleAstNode(node:AstNode):string {
                        throw Error("should not have gotten to this handler when all sample nodes have handlers")
                    }

                    handleIdentifier(node:Identifier):string {
                        return "3"
                    }

                    handleQualifiedName(node:QualifiedName):string {
                        return "2"
                    }

                    handleTypeReference(node:TypeReference):string {
                        return "1"
                    }
                }

                let dispatcher = new dispatcherConstructor()

                let identOsem = new Identifier("osem")
                let identBamba = new Identifier("bamba")
                let qn = new QualifiedName([identOsem, identBamba])
                let typeRef = new TypeReference(qn)

                let actualResult = typeRef.visit(dispatcher)
                const expectedResult = ["1", "2", "3", "3"]
                expect(actualResult).to.contain.members(expectedResult)
                expect(expectedResult).to.contain.members(actualResult)
                expect(actualResult.length).to.equal(expectedResult.length)
            })
        })

    })
}
