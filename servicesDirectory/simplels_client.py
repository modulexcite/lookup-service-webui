from operator import itemgetter
import urllib
import urlparse

import concurrent.futures
import requests

_LS_HINTS = 'http://ps1.es.net:8096/lookup/activehosts.json'
_MAX_CONCURRENT_REQUESTS = 4

def get_hosts():
	return list(get_hosts_gen())

def get_hosts_gen():
	hosts = requests.get(_LS_HINTS).json()["hosts"]
	hosts = sorted(hosts, key = itemgetter("priority"), reverse=True)
	for host in hosts:
		if host["status"] == "alive":
			yield host["locator"]

def refresh_hosts():
	_ls_hosts = get_hosts()

_ls_hosts = get_hosts()

def query(query = "", hosts = _ls_hosts):
	try:
		query = hash_to_query(query)
	except TypeError:
		pass
	json = []
	urls = [(host + "?" + query) for host in _ls_hosts]
	with concurrent.futures.ThreadPoolExecutor(max_workers = _MAX_CONCURRENT_REQUESTS) as pool:
		for response in pool.map(requests.get, urls):
			json += response.json()
	return json
	
def hash_to_query(query_hash = {}):
	query = urllib.urlencode(query_hash, True)
	return query

def query_to_hash(query = ""):
	query_hash = urlparse.parse_qs(query)
	return query_hash
