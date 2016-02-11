import * as _ from "lodash"
import {AstNode} from "../src/pudu/ast"
import {setParent} from "../src/pudu/builder";

export function setParentRecursively(node:AstNode) {
    setParent(node)
    let children = node.children()
    _.forEach(children, setParentRecursively)
}
