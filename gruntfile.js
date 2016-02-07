module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json')

    //noinspection UnnecessaryLabelJS
    grunt.initConfig({
        pkg: pkg,

        mocha_istanbul: {
            pudu: {
                src:     'bin/test/pudu',
                options: {
                    mask:           '**/*spec.js',
                    coverageFolder: 'bin/coverage'
                }
            },

            jes: {
                src:     'bin/test/jes',
                options: {
                    mask:           '**/*spec.js',
                    coverageFolder: 'bin/coverage'
                }
            }
        },

        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },

            files: {
                // performance_spec causes issues with TS-Lint randomly crashing due to a very large sample string it contains.
                src: ['src/pudu/**/*.ts', 'src/jes/**/*.ts', 'test/pudu/**/*.ts', 'test/jes/**/*.ts']
            }
        },

        ts: {
            options: {
                bin:  "ES5",
                fast: "never"

            },

            all: {
                src:     ['src/**/*.ts', 'test/**/*.ts'],
                outDir:  'bin/',
                options: {
                    module : "commonjs",
                    declaration:    false,
                    removeComments: false,
                    sourceMap:      true
                }
            }
        },

        clean: {
            all: ["bin"]
        }
    })

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', [
        'clean:all',
        'tslint',
        'ts:all'
    ])

    grunt.registerTask('test', [
            'build',
            'mocha_istanbul:pudu',
            'mocha_istanbul:jes'
        ]
    )
}
