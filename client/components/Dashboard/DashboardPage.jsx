import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import
{ loadUserDocuments, loadAllDocuments } from '../../actions/documentActions';
import DocumentList from '../DocumentPage/DocumentList.jsx';
import Modal from '../Common/Modal.jsx';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPrivate: false
    };
  }

  componentWillMount() {
    this.props.loadAllDocuments();
  }

  componentDidMount() {
    $('.modal').modal();
    $('select').material_select();
    $('.tooltipped').tooltip({ delay: 50 });
    $('.dropdown-button').dropdown();
    $('ul.tabs').tabs();
    $('ul.tabs').tabs('select_tab', 'public');
  }

  render() {
    const { publicDocuments, roleDocuments, privateDocuments } = this.props;
    return (
      <div className=" dashboard row">
        <div className="col s12">
          <div className="col s12 z-depth-5 card-panel">
            <h5 className="center">Dashboard</h5>
            <div>
              <div className="row">
                <div className="col s12">
                  <ul
                    className="tabs tab-demo-active z-depth-1 blue-grey">
                    <li className="tab col s4">
                      <a className="white-text waves-effect waves-light active"
                        href="#public">Public</a>
                    </li>
                    <li className="tab col s4">
                      <a className="white-text waves-effect waves-light"
                        href="#role">Role</a>
                    </li>
                    <li className="tab col s4">
                      <a className="white-text waves-effect waves-light"
                        href="#private">Private</a>
                    </li>
                  </ul>
                </div>
                <div className="col s12">
                  <Modal />
                  <div id="private" className="col s12 tab-style">
                    <h6 className="center">All Private Documents</h6>
                    <DocumentList docs={privateDocuments} />
                  </div>
                  <div id="public" className="col s12 tab-style">
                    <h6 className="center">All Public Documents</h6>
                    <DocumentList docs={publicDocuments} />
                  </div>
                  <div id="role" className="col s12 tab-style">
                    <h6 className="center">All Accessible Role Documents</h6>
                    <DocumentList docs={roleDocuments} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardPage.propTypes = {
  auth: PropTypes.object,
  loadAllDocuments: PropTypes.func.isRequired,
  loadUserDocuments: PropTypes.func.isRequired,
  privateDocuments: PropTypes.array.isRequired,
  publicDocuments: PropTypes.array.isRequired,
  roleDocuments: PropTypes.array.isRequired,
};

const filterDocument = (role, documents) =>
  documents.filter(document => document.access === role);


/**
 * Helper function to get only required properties from state
 * @param {any} state
 * @returns {any}
 */
function mapStateToProps(state) {
  const { documents } = state.handleDocuments;
  const publicDocuments = filterDocument('public', documents);
  const roleDocuments = filterDocument('role', documents);
  const privateDocuments = filterDocument('private', documents);

  return {
    auth: state.auth,
    publicDocuments,
    roleDocuments,
    privateDocuments
  };
}


export default connect(mapStateToProps,
  { loadUserDocuments, loadAllDocuments })(DashboardPage);

