namespace jes.core.ast.builder {

    import ParseTree = jes.parseTree.ParseTree
    import Token = chevrotain.Token

    export interface IMatchCase {
        CASE:Function, // a Token Constructor
        THEN:Function  // The Action to perform
    }

    export function MATCH_CHILDREN(root:ParseTree, ...cases:IMatchCase[]):void {

        _.forEach(root.children, (currChild) => {
            let matchingCase = _.find(cases,
                (currCase) => currChild.payload instanceof currCase.CASE)

            if (_.isUndefined(matchingCase)) {
                let childClassName = utils.getClassNameFromInstance(currChild)
                throw Error(`non exhaustive match, no case for <${childClassName}>`)
            }
            matchingCase.THEN()
        })
    }

    export function setParent(node:AstNode):void {
        _.forEach(node.children(), (currChild) => {
            (<any>currChild)._parent = node
        })
    }
}
