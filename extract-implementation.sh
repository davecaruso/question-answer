if ! [ -e /r/website/root/q+a ]; then
  echo This script is only runnable on dave caruso\'s computer in order to
  echo extract question implementation data. Fear not, as some version of
  echo it is already available in ./implementation
fi

QA=$PWD
cd /r/website
./scripts/make-qa-impl.sh
cp ./qa_impl/* $QA/implementation
