import React, { useState, useEffect } from 'react';

const Request = (props) => {
  const [connected, setConnected] = useState(false);
  function verifyIfConnected () {
    const domain = 'http://localhost:80';
    const method = props.method;
    const data = props.data;
    let route = '/';
    if (undefined !== props.route.split(/\//)[1]) {
      route += '?module=' + props.route.split(/\//)[1];
      if (undefined !== props.route.split(/\//)[2]) {
        route += '&action=' + props.route.split(/\//)[2];
        if (undefined !== props.route.split(/\//)[3]) {
          route += '&param=' + props.route.split(/\//)[3];
        }
      }
    }
    fetch(domain + route, {
      method: method,
      headers: 'POST' === method ? {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      } : null,
      body: 'POST' === method ? JSON.stringify(data) : null
    })
      .then(response => response.json())
      .then(jsonResponse => setConnected(jsonResponse['connected']))
      .catch(networkError => console.log(networkError))
  }
  useEffect(() => {
    verifyIfConnected();
  });
  return <span className="offset-lg-1 pt-lg-3 pt-sm-3">{connected ? 'Vous êtes connecté en tant que ' + props.data['pseudo'] : 'Non connecté'}</span>;
}

export default Request;