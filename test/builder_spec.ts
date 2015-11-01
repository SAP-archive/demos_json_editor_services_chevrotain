namespace jes.core.ast.builder.spec {


    import VirtualToken = chevrotain.VirtualToken;
    import ParseTree = jes.parseTree.ParseTree
    const expect = chai.expect

    class Root extends VirtualToken {}
    class A extends VirtualToken {}
    class B extends VirtualToken {}
    class C extends VirtualToken {}

    class C2 extends C {}
    class C3 extends C {}


    class Identifier extends AstNode {}

    class GoPackageName extends AstNode {
        constructor(public pkgName:Identifier, public itemName:Identifier) {super()}
    }


    describe("The Core AstBuilder", () => {

        // TODO: nested describe for the pattern matcher IT
        it("Implements a pattern patcher by ParseTree payload class type - simple", () => {
            let input = new ParseTree(new Root(),
                [
                    new ParseTree(new A()),
                    new ParseTree(new B()),
                    new ParseTree(new C())
                ])

            let actual = ""

            MATCH_CHILDREN(input,
                {CASE: A, THEN: () => actual += "A"},
                {CASE: B, THEN: () => actual += "B"},
                {CASE: C, THEN: () => actual += "C"}
            )

            expect(actual).to.equal("ABC")
        })

        it("Implements a pattern patcher by ParseTree payload class type - hierarchy", () => {
            let input = new ParseTree(new Root(),
                [
                    new ParseTree(new A()),
                    new ParseTree(new C2()),
                    new ParseTree(new C3()),
                    new ParseTree(new C())
                ])

            let actual = ""

            MATCH_CHILDREN(input,
                {CASE: A, THEN: () => actual += "A"},
                {CASE: B, THEN: () => actual += "B"},
                {CASE: C2, THEN: () => actual += "C2"},
                {CASE: C3, THEN: () => actual += "C3"},
                {CASE: C, THEN: () => actual += "C"}
            )

            expect(actual).to.equal("AC2C3C")
        })


        it("Implements a pattern patcher by ParseTree payload class type - non exhaustive match", () => {
            let input = new ParseTree(new Root(),
                [
                    new ParseTree(new A()),
                    new ParseTree(new C()) // no matching CASE for C in the pattern matcher below
                ])

            let actual = ""

            expect(() => MATCH_CHILDREN(input,
                {CASE: A, THEN: () => actual += "A"},
                {CASE: B, THEN: () => actual += "B"}
            )).to.throw("non exhaustive match")
        })

        // TODO: consider setParent on constructor of AstNode instead of using a utility???
        it("Implements a utility to set the parent of an AstNode", () => {
            let heapPkg = new Identifier()
            let popFunc = new Identifier()

            let fqn = new GoPackageName(heapPkg, popFunc)

            expect(heapPkg.parent()).to.equal(NIL)
            expect(popFunc.parent()).to.equal(NIL)

            setParent(fqn)

            expect(heapPkg.parent()).to.equal(fqn)
            expect(popFunc.parent()).to.equal(fqn)
        })

    })
}
