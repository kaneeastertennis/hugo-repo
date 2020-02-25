dev:
	mkdir -p ./public
	linux/hugo server -w

deploy:
	mkdir -p ./public
	linux/hugo
	cp -R ./public/* ../kaneeastertennis.github.io/
	cd ../kaneeastertennis.github.io/; \
		git add --all .; git commit -m new; git push

clean:
	rm -rf ./public
