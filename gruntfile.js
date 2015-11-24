module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json')

    //noinspection UnnecessaryLabelJS
    grunt.initConfig({
        pkg: pkg,

        karma: {

            options: {
                singleRun:  true,
                browsers:   ['Chrome']
            },

            pudu: {
                options: {
                    configFile: 'karma.pudu.conf.js'
                }
            },

            jes: {
                options: {
                    configFile: 'karma.jes.conf.js'
                }
            },

            dev_build: {}
        },

        mocha_istanbul: {
            pudu: {
                src:     'bin/pudu/pudu.js',
                options: {
                    root:           './bin/pudu',
                    mask:           '*spec.js',
                    coverageFolder: 'bin/pudu/coverage',
                    excludes:       ['pudu_spec.js']
                }
            },

            jes: {
                src:     'bin/jes/jes.js',
                options: {
                    root:           './bin/jes',
                    mask:           '*spec.js',
                    coverageFolder: 'bin/jes/coverage',
                    excludes:       ['jes_spec.js']
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

            pudu: {
                src:     ['build/pudu.ts'],
                out:     'bin/pudu/pudu.js',
                options: {
                    declaration:    true,
                    removeComments: false,
                    sourceMap:      false
                }
            },

            pudu_spec: {
                src:     ['build/pudu_spec.ts'],
                out:     "bin/pudu/pudu_spec.js",
                options: {
                    declaration:    false,
                    removeComments: false,
                    sourceMap:      false
                }
            },

            jes: {
                src:     ['build/jes.ts'],
                out:     'bin/jes/jes.js',
                options: {
                    declaration:    true,
                    removeComments: false,
                    sourceMap:      false
                }
            },

            jes_spec: {
                src:     ['build/jes_spec.ts'],
                out:     "bin/jes/jes_spec.js",
                options: {
                    declaration:    false,
                    removeComments: false,
                    sourceMap:      false
                }
            }
        },

        // TODO: the relative deps to sub modules need to be removed.
        //       should use separate modules on NPM ?
        umd: {

            pudu: {
                options: {
                    src:            'bin/pudu/pudu.js',
                    objectToExport: 'pudu',
                    amdModuleId:    'pudu',
                    globalAlias:    'pudu',
                    deps:           {
                        'default': ['_', 'chevrotain'],
                        amd:       ['lodash', 'chevrotain'],
                        cjs:       ['lodash', 'chevrotain'],
                        global:    ['_', 'chevrotain']
                    }
                }
            },

            pudu_spec: {
                options: {
                    src:  'bin/pudu/pudu_spec.js',
                    deps: {
                        'default': ['_', 'pudu', 'chai', 'chevrotain'],
                        amd:       ['lodash', './pudu', 'chai', 'chevrotain'],
                        cjs:       ['lodash', './pudu', 'chai', 'chevrotain'],
                        global:    ['_', 'pudu', 'chai', 'chevrotain']
                    }
                }
            },

            jes: {
                options: {
                    src:            'bin/jes/jes.js',
                    objectToExport: 'jes',
                    amdModuleId:    'jes',
                    globalAlias:    'jes',
                    deps:           {
                        'default': ['_', 'chevrotain', 'pudu'],
                        amd:       ['lodash', 'chevrotain', '../pudu/pudu'],
                        cjs:       ['lodash', 'chevrotain', '../pudu/pudu'],
                        global:    ['_', 'chevrotain', 'pudu']
                    }
                }
            },

            jes_spec: {
                options: {
                    src:  'bin/jes/jes_spec.js',
                    deps: {
                        'default': ['_', 'pudu', 'jes', 'chai', 'chevrotain'],
                        amd:       ['lodash', '../pudu/pudu', './jes', 'chai', 'chevrotain'],
                        cjs:       ['lodash', '../pudu/pudu', './jes', 'chai', 'chevrotain'],
                        global:    ['_', 'pudu', 'jes', 'chai', 'chevrotain']
                    }
                }
            }
        },

        clean: {
            all:  ["bin"],
            dev:  ["bin/gen"],
            pudu: ["bin/pudu"],
            jes:  ["bin/jes"]
        }
    })

    grunt.loadNpmTasks('grunt-karma')
    grunt.loadNpmTasks('grunt-tslint')
    grunt.loadNpmTasks("grunt-ts")
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-mocha-istanbul')
    grunt.loadNpmTasks('grunt-umd')


    grunt.registerTask('pudu_build', [
        'clean:pudu',
        'tslint',
        'ts:pudu',
        'ts:pudu_spec',
        'umd:pudu',
        'umd:pudu_spec'
    ])

    grunt.registerTask('pudu_test', [
        'pudu_build',
        'mocha_istanbul:pudu']
    )

    grunt.registerTask('jes_build', [
        'clean:jes',
        'tslint',
        'ts:jes',
        'ts:jes_spec',
        'umd:jes',
        'umd:jes_spec'
    ])

    grunt.registerTask('jes_test', [
        'jes_build',
        'mocha_istanbul:jes']
    )

    grunt.registerTask('dev_build', [
        'clean:dev',
        'tslint',
        'ts:dev_build',
        'karma:pudu',
        'karma:jes'
    ])

    grunt.registerTask('build_test_all', [
        'clean:all',
        'pudu_test',
        'jes_test'
    ])

}
