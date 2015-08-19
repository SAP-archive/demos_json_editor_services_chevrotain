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
                src:     'bin/json_editor_services.js',
                options: {
                    root:           './bin/',
                    mask:           '*servicesSpecs.js',
                    coverageFolder: 'bin/coverage',
                    excludes:       ['*servicesSpecs.js']
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
                src:     ['build/json_editor_services.ts'],
                out:     'bin/json_editor_services.js',
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
                    'bin/json_editor_servicesSpecs.js': [
                        'bin/tsc/test/parse_tree_spec.js'
                    ]
                }
            }
        },

        umd: {
            release: {
                options: {
                    src:            'bin/json_editor_services.js',
                    objectToExport: 'json_editor_services',
                    amdModuleId:    'json_editor_services',
                    globalAlias:    'json_editor_services',
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
                    src:      'bin/json_editor_servicesSpecs.js',
                    deps:     {
                        'default': ['_', 'json_editor_services', 'chai', 'chevrotain'],
                        amd:       ['lodash', 'json_editor_services', 'chai', 'chevrotain'],
                        cjs:       ['lodash', './json_editor_services', 'chai', 'chevrotain'],
                        global:    ['_', 'json_editor_services', 'chai', 'chevrotain']
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
