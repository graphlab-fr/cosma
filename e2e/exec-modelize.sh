cd e2e/

rm -rf ../temp
mkdir ../temp

cd citeproc
cosma modelize --citeproc
cd ..

mv ../temp/cosmoscope.html ../temp/citeproc.html

cd citeproc
cosma modelize
cd ..

mv ../temp/cosmoscope.html ../temp/no-citeproc.html

cd timeline
cosma modelize
cd ..

mv ../temp/cosmoscope.html ../temp/timeline.html

cd batch
cosma batch ./data.json
cosma modelize
cd ..

mv ../temp/cosmoscope.html ../temp/batch.html
rm ../temp/**.md

cd batch
cosma autorecord Toto personne tag1,tag2
cosma autorecord Tata institution
cosma autorecord Tutu
cosma modelize
cd ..

mv ../temp/cosmoscope.html ../temp/records.html