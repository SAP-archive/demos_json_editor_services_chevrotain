namespace jes.grammar.spec {

    const expect = chai.expect

    describe("The Grammar namespace", () => {

        it("exposes a dts Lexer + Parser", () => {
            let lexResult = DTSLexer.tokenize(samples.chai)
            let parser = new DTSParser(lexResult.tokens)

            parser.DeclarationSourceFile()
            expect(parser.errors).to.be.empty
        })


        it("will output a parseTree", () => {

            let sampleInput =
                `interface ModalOptions {
                show: boolean;
                remote: string;
            }"`

            let lexResult = DTSLexer.tokenize(sampleInput)
            let parser = new DTSParser(lexResult.tokens)
            let parsingResult = parser.DeclarationSourceFile()
            expect(parsingResult).to.be.instanceOf(jes.parseTree.ParseTree)
            expect(parsingResult.payload).to.be.instanceOf(DeclarationSourceFile)
            expect(parsingResult.children).to.have.length(1)

            let decElem = parsingResult.children[0]
            expect(decElem.payload).to.be.instanceOf(DeclarationElement)
            expect(decElem.children).to.have.length(1)

            let interfaceDec = decElem.children[0]
            expect(interfaceDec.payload).to.be.instanceOf(InterfaceDeclaration)
            expect(interfaceDec.children).to.have.length(3)

            let interfaceName = interfaceDec.children[0]
            let interfaceBody = interfaceDec.children[1]
            let interfaceSyntaxBox = interfaceDec.children[2]

            expect(interfaceName.payload).to.be.instanceOf(Identifier)
            expect(interfaceBody.payload).to.be.instanceOf(ObjectType)
            expect(interfaceSyntaxBox.payload).to.be.instanceOf(SyntaxBox)

            expect(interfaceName.children).to.be.empty // TODO: should this really be empty? or build a syntaxbox ?
            expect(interfaceBody.children).to.have.length(2)
            expect(interfaceSyntaxBox.children).to.have.length(2)
            expect(interfaceSyntaxBox.children[0].payload).to.be.instanceOf(InterfaceToken)
            expect(interfaceSyntaxBox.children[1].payload).to.be.instanceOf(Identifier)

            let typeBody = interfaceBody.children[0]
            expect(typeBody.payload).to.be.instanceOf(TypeBody)
            let objBodySyntaxBox = interfaceBody.children[1]
            expect(objBodySyntaxBox.payload).to.be.instanceOf(SyntaxBox)
            expect(objBodySyntaxBox.children[0].payload).to.be.instanceOf(LCurly)
            expect(objBodySyntaxBox.children[1].payload).to.be.instanceOf(RCurly)

            expect(typeBody.children).to.have.length(3)
            let showElem = typeBody.children[0]
            let remoteElem = typeBody.children[1]
            let typeBodySyntaxBox = typeBody.children[2]
            expect(typeBodySyntaxBox.children).to.have.length(2)
            expect(typeBodySyntaxBox.children[0].payload).to.be.an.instanceOf(Semicolon)
            expect(typeBodySyntaxBox.children[1].payload).to.be.an.instanceOf(Semicolon)

            expect(showElem.payload).to.be.an.instanceOf(PropertySignatureOrMethodSignature)
            expect(remoteElem.payload).to.be.an.instanceOf(PropertySignatureOrMethodSignature)
            expect(showElem.children).to.have.length(2)
            expect(remoteElem.children).to.have.length(2)

            let showElemPropName = showElem.children[0]
            let showElemTypeAnno = showElem.children[1]
            let remoteElemPropName = remoteElem.children[0]
            let remoteElemTypeAnno = remoteElem.children[1]

            expect(showElemPropName.payload).to.be.an.instanceOf(PropertyName)
            expect(remoteElemPropName.payload).to.be.an.instanceOf(PropertyName)
            expect(showElemPropName.children[0].payload).to.be.an.instanceOf(Identifier)
            expect(remoteElemPropName.children[0].payload).to.be.an.instanceOf(Identifier)

            expect(showElemTypeAnno.payload).to.be.an.instanceOf(TypeAnnotation)
            expect(remoteElemTypeAnno.payload).to.be.an.instanceOf(TypeAnnotation)
            expect(showElemTypeAnno.children).to.have.length(2)
            expect(remoteElemTypeAnno.children).to.have.length(2)

            let showType = showElemTypeAnno.children[0]
            let remoteType = remoteElemTypeAnno.children[0]
            let showAnnoSyntaxBox = showElemTypeAnno.children[1]
            let remoteAnnoSyntaxBox = remoteElemTypeAnno.children[1]

            expect(showAnnoSyntaxBox.children).to.have.length(1)
            expect(showAnnoSyntaxBox.payload).to.be.an.instanceOf(SyntaxBox)
            expect(showAnnoSyntaxBox.children[0].payload).to.be.an.instanceOf(Colon)
            expect(remoteAnnoSyntaxBox.children).to.have.length(1)
            expect(remoteAnnoSyntaxBox.payload).to.be.an.instanceOf(SyntaxBox)
            expect(remoteAnnoSyntaxBox.children[0].payload).to.be.an.instanceOf(Colon)

            expect(showType.payload).to.be.an.instanceOf(PrimaryOrUnionType)
            expect(remoteType.payload).to.be.an.instanceOf(PrimaryOrUnionType)

            expect(showType.children).to.have.length(1)
            expect(remoteType.children).to.have.length(1)

            let showPrimaryType = showType.children[0]
            let remotePrimaryType = remoteType.children[0]
            expect(showPrimaryType.payload).to.be.an.instanceOf(PrimaryType)
            expect(remotePrimaryType.payload).to.be.an.instanceOf(PrimaryType)

            expect(showPrimaryType.children).to.have.length(1)
            expect(remotePrimaryType.children).to.have.length(1)

            let showPredefinedType = showPrimaryType.children[0]
            let remotePredefinedType = remotePrimaryType.children[0]

            expect(showPredefinedType.payload).to.be.an.instanceOf(PredefinedType)
            expect(remotePredefinedType.payload).to.be.an.instanceOf(PredefinedType)
            expect(showPredefinedType.children).to.have.length(1)
            expect(remotePredefinedType.children).to.have.length(1)

            expect(showPredefinedType.children[0].payload).to.be.an.instanceOf(BooleanToken)
            expect(remotePredefinedType.children[0].payload).to.be.an.instanceOf(StringToken)
        })
    })
}