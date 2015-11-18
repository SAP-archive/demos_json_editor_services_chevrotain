namespace jes.grammar {

    import Token = chevrotain.Token
    import VirtualToken = chevrotain.VirtualToken
    import Lexer = chevrotain.Lexer
    import PT = pudu.parseTree.PT
    import ParseTree = pudu.parseTree.ParseTree;


    // TODO: maybe these utils belong in the core? probably...
    export abstract class ParseTreeToken extends VirtualToken {}
    export abstract class SyntaxBox extends ParseTreeToken {}

    function SYNTAX_BOX(tokens:Token[]):ParseTree | any {
        let tokensCompcat = _.compact(tokens)
        let tokensTrees = _.map(tokensCompcat, (currToken) => PT(currToken))
        return _.isEmpty(tokensTrees) ? undefined : PT(SyntaxBox, tokensTrees)
    }

    function CHILDREN(...children:any[]):ParseTree[] {
        let flatChildren = _.flatten(children)
        let existingFlatChildren = _.compact(flatChildren)

        return _.map(existingFlatChildren, (currChild:any) => {
            return currChild instanceof ParseTree ?
                currChild :
                PT(currChild)
        })
    }


}
