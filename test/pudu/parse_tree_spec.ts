import {ParseTree} from "../../src/pudu/parse_tree"
import {Token} from "chevrotain"

describe("The parseTree namespace", () => {

    it("exposes a constructor for a ParseTree", () => {
        let tree = new ParseTree(new Token("bamba", 1, 2, 3, 4, 5), [])
        expect(tree.children).to.have.length(0)
        expect(tree.getImage()).to.equal("bamba")
    })

})
