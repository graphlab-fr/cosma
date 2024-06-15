cd e2e/

rm -rf ../temp
mkdir ../temp

cd citeproc
cosma modelize --citeproc
cd ..

mv ../temp/cosmoscope.html ../temp/citeproc.html

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
cosma autorecord Toto concept tag1,tag2
cosma autorecord Tata concept
cosma autorecord Tutu
cosma modelize
cd ..

mv ../temp/cosmoscope.html ../temp/records.html