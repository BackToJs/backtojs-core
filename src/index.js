import './styles/index.scss'
import ModulesFactory from './autoconfigure/factory'

let modulesFactory = new ModulesFactory();
modulesFactory.discover();
