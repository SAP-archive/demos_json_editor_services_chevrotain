module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json')

    //noinspection UnnecessaryLabelJS
    grunt.initConfig({
        pkg: pkg,

        karma: {
            options: {
                configFile: 'karma.conf.js',
                singleRun:  true,
                browsers:   ['Chrome']
            },

            dev_build: {}
        },

        mocha_istanbul: {
            coverage: {
                src:     'bin/jes.js',
                options: {
                    root:           './bin/',
                    mask:           'jesSpecs.js',
                    coverageFolder: 'bin/coverage',
                    excludes:       ['jesSpecs.js']
                }
            }
        },

        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },

            files: {
                // performance_spec causes issues with TS-Lint randomly crashing due to a very large sample string it contains.
                src: ['src/**/*.ts', 'test/**/*.ts']
            }
        },

        ts: {
            options: {
                bin:  "ES5",
                fast: "never"

            },

            dev_build: {
                src:    ["**/*.ts", "!node_modules/**/*.ts", "!build/**/*.ts", "!bin/**/*.ts"],
                outDir: "bin/gen"
            },

            release: {
                src:     ['build/jes.ts'],
                out:     'bin/jes.js',
                options: {
                    declaration:    true,
                    removeComments: false,
                    sourceMap:      false // due to UMD and concat generated headers the original source map will be invalid.
                }
            },

            // this is the same as the 'build' process, all .ts --> .js in gen directory
            // in a later step those files will be aggregated into separate components
            release_test_code: {
                src:     ["**/*.ts", "!node_modules/**/*.ts", "!build/**/*.ts", "!bin/**/*.ts"],
                outDir:  "bin/tsc",
                options: {
                    declaration:    true,
                    removeComments: false,
                    sourceMap:      false // due to UMD and concat generated headers the original source map will be invalid.
                }
            }
        },

        concat: {
            release: {
                files: {
                    'bin/jesSpecs.js': [
                        'bin/tsc/test/samples/chai.js',
                        'bin/tsc/test/parse_tree_spec.js',
                        'bin/tsc/test/grammar_spec.js',
                        'bin/tsc/test/ast_spec.js',
                        'bin/tsc/test/dispatcher_spec.js',
                        'bin/tsc/test/builder_spec.js'
                    ]
                }
            }
        },

        umd: {
            release: {
                options: {
                    src:            'bin/jes.js',
                    objectToExport: 'jes',
                    amdModuleId:    'jes',
                    globalAlias:    'jes',
                    deps:           {
                        'default': ['_', 'chevrotain'],
                        amd:       ['lodash', 'chevrotain'],
                        cjs:       ['lodash', 'chevrotain'],
                        global:    ['_', 'chevrotain']
                    }
                }
            },

            release_specs: {
                options: {
                    src:      'bin/jesSpecs.js',
                    deps:     {
                        'default': ['_', 'jes', 'chai', 'chevrotain'],
                        amd:       ['lodash', 'jes', 'chai', 'chevrotain'],
                        cjs:       ['lodash', './jes', 'chai', 'chevrotain'],
                        global:    ['_', 'jes', 'chai', 'chevrotain']
                    }
                }
            }
        },

        clean: {
            all: ["bin"],
            dev: ["bin/gen"]
        }
    })

    grunt.loadNpmTasks('grunt-karma')
    grunt.loadNpmTasks('grunt-tslint')
    grunt.loadNpmTasks("grunt-ts")
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-mocha-istanbul')
    grunt.loadNpmTasks('grunt-umd')


    var buildTaskTargets = [
        'clean:all',
        'tslint',
        'ts:release',
        'ts:release_test_code',
        'concat:release',
        'umd:release',
        'umd:release_specs'
    ]

    grunt.registerTask('build', buildTaskTargets)
    grunt.registerTask('build_and_test', buildTaskTargets.concat(['mocha_istanbul:coverage']))
    grunt.registerTask('test', ['mocha_istanbul:coverage'])

    grunt.registerTask('dev_build', [
        'clean:all',
        'tslint',
        'ts:dev_build',
        'karma:dev_build',
        'tslint'
    ])

}
