compile:
	mkdir -p ./public
	hugo server -w

deploy: compile
	cp -R ./public/* ../kaneeastertennis.github.io/
	cd ../kaneeastertennis.github.io/; \
		git add --all .; git commit -m new; git push
