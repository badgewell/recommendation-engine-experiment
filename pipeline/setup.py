import setuptools

REQUIRED_PACKAGES = [
    'apache-beam[gcp]==2.11.*',
    'pandas==0.24.*',
    'numpy==1.16.*',
    'gcsfs==0.2.*',
]

setuptools.setup(
    name='reco',
    version='0.0.2',
    install_requires=REQUIRED_PACKAGES,
    packages=setuptools.find_packages(),
    include_package_data=True,
    description='recommendation system',
)
