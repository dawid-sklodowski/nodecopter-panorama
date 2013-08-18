directory=$1
script="/Applications/Hugin/HuginTools"

die() {
  echo "Error: $1"
  exit 1
}

test -e "$directory" || die 'You must provide directory'
rm -rf $directory/panoramize
mkdir $directory/panoramize
$script/pto_gen -o $directory/panoramize/project.pto $directory/*.png
$script/cpfind -o $directory/panoramize/project.pto --multirow --celeste $directory/panoramize/project.pto
$script/cpclean -o $direcotry/panoramize/project.pto $directory/panoramize/project.pto
$script/linefind -o $directory/panoramize/project.pto $directory/panoramize/project.pto
$script/autooptimiser -a -m -l -s -o $directory/panoramize/project.pto $directory/panoramize/project.pto
$script/pano_modify --canvas=AUTO --crop=AUTO -o $directory/panoramize/project.pto $directory/panoramize/project.pto
$script/pto2mk -o $directory/panoramize/project.mk -p prefix $directory/panoramize/project.pto
$script/make -f $directory/panoramize/project.mk all
$script/nona -m TIFF_m -o $directory/panoramize/project $directory/panoramize/project.pto
$script/enblend -a -o $directory/panoramize/project.tif $directory/panoramize/project*.tif

open $directory/panoramize/project.tif
