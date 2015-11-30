namespace jes.api {

    import JsonLexer = jes.lexer.JsonLexer
    import JsonParser = jes.parser.JsonParser
    import buildObjectNode = jes.ast.builder.buildObjectNode

    export interface ITextAnalysisResult {
        lexErrors: chevrotain.ILexingError[],
        parseErrors: chevrotain.exceptions.IRecognitionException[],
        ast:jes.ast.ObjectNode
    }

    export function analyzeText(text:string):ITextAnalysisResult {
        let lexResult = JsonLexer.tokenize(text)
        let parser = new JsonParser(lexResult.tokens)
        let parseTree = parser.object()
        let ast = buildObjectNode(parseTree)


        return {
            lexErrors:   lexResult.errors,
            parseErrors: parser.errors,
            ast:         ast
        }
    }
}