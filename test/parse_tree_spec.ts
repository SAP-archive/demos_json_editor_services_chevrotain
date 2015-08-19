const expect = chai.expect
const Token = chevrotain.Token

namespace json_editor_services.parseTree.spec {

    describe("The parseTree namespace", function () {

        it("exposes a constructor for a ParseTree", function () {
            let tree = new ParseTree(new Token("bamba", 1, 2, 3, 4, 5), [])
            expect(tree.children).to.have.length(0)
            expect(tree.getImage()).to.equal("bamba")
        })

    })
}
