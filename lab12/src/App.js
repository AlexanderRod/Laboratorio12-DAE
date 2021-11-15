import React,{Component} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class App extends Component{
  constructor(props){
    super(props);
    this.state = ({
      biblioteca:[],
      pos:null,
      titulo:'Nuevo',
      id:0,
      nombre:'',
      fecha:'',
      numerospag:'0',
      categoria:''
    })
    this.cambioNombre = this.cambioNombre.bind(this);
    this.cambioFecha = this.cambioFecha.bind(this);
    this.cambioNumerospag = this.cambioNumerospag.bind(this);
    this.cambioCategoria = this.cambioCategoria.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);
  }

  cambioNombre(e){
    this.setState({
      nombre: e.target.value
    })
  }

  cambioFecha(e){
    this.setState({
      fecha: e.target.value
    })
  }

  cambioNumerospag(e){
    this.setState({
      numerospag: e.target.value
    })
  }

  cambioCategoria(e){
    this.setState({
      categoria: e.target.value
    })
  }

  

  componentDidMount(){
    axios.get('https://rodrigoapi.herokuapp.com/biblioteca/')
    .then(res =>{
      console.log(res.data);
      this.setState({biblioteca: res.data})
    })
  }

  mostrar(cod,index){
    axios.get('https://rodrigoapi.herokuapp.com/biblioteca/'+cod)
    .then(res => {
      this.setState({
        pos: index,
        titulo: 'Editar',
        id: res.data.id,
        nombre :res.data.name,
        fecha: res.data.release_date,
        numerospag: res.data.numerospag,
        categoria : res.data.category
      })
    })
  }

  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    const datos = {
      name: this.state.nombre,
      release_date: this.state.fecha,
      numerospag: this.state.numerospag,
      category: this.state.categoria
    }
    if(cod>0){
      //edición de un registro
      axios.put('https://rodrigoapi.herokuapp.com/biblioteca/'+cod,datos)
      .then(res =>{
        let indx = this.state.pos;
        this.state.biblioteca[indx] = res.data;
        var temp = this.state.biblioteca;
        this.setState({
          pos:null,
          titulo:'Nuevo',
          id:0,
          nombre:'',
          fecha:'',
          numerospag:0,
          categoria:'',
          biblioteca: temp
        });
      }).catch((error) =>{
        console.log(error.toString());
      });
    }else{
      //nuevo registro
      axios.post('https://rodrigoapi.herokuapp.com/biblioteca/',datos)
      .then(res => {
        this.state.biblioteca.push(res.data);
        var temp = this.state.biblioteca;
        this.setState({
          id:0,
          nombre:'',
          fecha: '',
          numerospag:0,
          categoria:'',
          biblioteca:temp
        });
      }).catch((error)=>{
        console.log(error.toString());
      });
    }
  }

  eliminar(cod){
    let rpta = window.confirm("Desea Eliminar?");
    if(rpta){
      axios.delete('https://rodrigoapi.herokuapp.com/biblioteca/'+cod)
      .then(res =>{
        var temp = this.state.biblioteca.filter((biblioteca)=>biblioteca.id !== cod);
        this.setState({
          biblioteca: temp
        })
      })
    }
  }

  render(){
    return(
    <div>
        <Container>
              <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Numero de Páginas</th>
                  <th>Categoria</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {this.state.biblioteca.map( (biblioteca,index) =>{
                  return (
                    <tr key={biblioteca.id}>
                      <td>{biblioteca.id}</td>
                      <td>{biblioteca.name}</td>
                      <td>{biblioteca.release_date}</td>
                      <td>{biblioteca.numerospag}</td>
                      <td>{biblioteca.category}</td>
                      <td>
                        <div class="d-grid gap-2 d-md-flex">
                          <Button type="button" variant="success" onClick={()=>this.mostrar(biblioteca.id,index)}>Editar</Button>
                          <Button type="button" variant="danger" onClick={()=>this.eliminar(biblioteca.id)}>Eliminar</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <hr />
            <h1>{this.state.titulo}</h1>
            <Form onSubmit={this.guardar}>
              <Form.Control type="hidden" value={this.state.id} />
              <Form.Group className="mb-3">
                <Form.Label>Ingrese Nombre:</Form.Label>
                <Form.Control type="text" value={this.state.nombre} onChange={this.cambioNombre} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ingrese el Numero de Páginas:</Form.Label>
                <Form.Control type="number" value={this.state.numerospag} onChange={this.cambioNumerospag} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Categoria:</Form.Label>
                <Form.Select type="text" value={this.state.categoria} onChange={this.cambioCategoria}>
                  <option>Ficcion</option>
                  <option>Biografica</option>
                  <option>Ciencia</option>
                  <option>Dramatico</option>
                  <option>Accion</option>
                  <option>Clasica</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha:</Form.Label>
                <Form.Control type="date" value={this.state.fecha} onChange={this.cambioFecha} />
              </Form.Group>
              <Button variant="primary" type="submit">
                GUARDAR
              </Button>
          </Form>
        </Container>
    </div>)
  }
}
export default App;
