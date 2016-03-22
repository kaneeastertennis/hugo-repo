dev:
	mkdir -p ./public
	hugo server -w

deploy:
	mkdir -p ./public
	hugo
	cp -R ./public/* ../kaneeastertennis.github.io/
	cd ../kaneeastertennis.github.io/; \
		git add --all .; git commit -m new; git push
