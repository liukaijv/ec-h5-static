module.exports = function(grunt) {
	grunt.initConfig({
		//文件合并
		concat: {
			// options: {
			// 	separator: '' //文件分隔 
			// },	
			// 文件合并
			basic: {
				files: {

					// main.js
					'js/main.js': [
					'js/core/ui.cookie.js',
					'js/core/ui.store.js',
					'js/core/ui.url.js',
					'js/core/ui.core.js',
					'js/core/ui.panel.js',
					'js/core/ui.button.js',
					'js/core/ui.tabs.js',
					'js/core/ui.spinner.js',
					'js/core/ui.select.js',
					'js/core/ui.mask.js',
					'js/core/ui.modal.js',
					'js/core/ui.notify.js',
					'js/core/ui.smoothScroll.js',
					// 'js/core/ui.imageloaded.js',
					// 'js/core/ui.imagelazyload.js',
					'js/core/ui.swipe.js',
					'js/core/ui.refresh.js',
					'js/core/ui.cityselect.js',
					'js/must.js'
					]
				},
			},
		},
		uglify: {		
			build: {
				src: 'js/main.js',
				dest: 'js/main.min.js'
			}			
		},
		// less 2 css
		less: {
			// 编译到测试项目
			development: {
				options: {
					paths: ["less"]
				},
				files: {
					"css/main.css": "less/core.less",
				}
			}
		},
		cssmin: {
		  options: {
		    // shorthandCompacting: false,
		    // roundingPrecision: -1
		  },
		  target: {
		    files: {
		      'css/main.min.css': ['css/main.css'],
		      'css/font-awesome.min.css': ['css/font-awesome.css'],
		    }
		  }
		},
		compress: {
			main: {
				options: {
					archive: 'html.zip'
				},
				files: [{
					expand: true,
					cwd: './',
					src: ['*.html','cart/*.html', 'shop/*.html', 'fonts/**', 'css/**', 'images/**', 'js/main.min.js', 'js/demo.js', 'js/lib/**'],
					dest: '',
					filter: 'isFile'
				}]
			}
		},
		copy: {
			main: {
				files: [{
					expand: true,
					src: ['*.html', 'cart/*.html', 'shop/*.html', 'fonts/**', 'css/**', 'images/**', 'js/main.min.js', 'js/demo.js', 'js/lib/**'],
					dest: 'D:/work/ECS6.3/cadmanager/TempHtml/h5/dist/',
					filter: 'isFile'
				}]
			},
			css: {
				files: [{
					expand: true,
					src: ['css/main.min.css'],
					dest: 'D:/work/ECS6.3/Weixin.WebUI/assets/',
					filter: 'isFile'
				}]
			},
			js: {
				files: [{
					expand: true,
					src: ['js/main.min.js'],
					dest: 'D:/work/ECS6.3/Weixin.WebUI/assets/',
					filter: 'isFile'
				}]
			},
		},
	});
	//load任务	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// 调用任务
	grunt.registerTask('default', ['less', 'cssmin', 'concat', 'uglify', 'copy']);
}