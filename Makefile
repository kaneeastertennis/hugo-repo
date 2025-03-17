.PHONY: preview render

preview:
	quarto preview

render:
	quarto render

deploy:
	cp -R ./_site/* ../kaneeastertennis.github.io/
	cd ../kaneeastertennis.github.io; \
		git add --all .; \
		git commit -m new; git push
