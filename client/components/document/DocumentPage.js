/* eslint class-methods-use-this: "off"*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentList from './DocumentList';
import * as documentActions from '../../actions/documentActions';
import CommonModal from '../common/CommonModal';

class DocumentPage extends React.Component {
  constructor(props) {
    super(props);

    this.deleteClick = this.deleteClick.bind(this);
  }

  componentWillMount() {
    this.props.actions.loadUserDocuments();
  }

  componentDidMount() {
    $('.modal').modal();
    $('select').material_select();
    $('.tooltipped').tooltip({ delay: 50 });
  }

  deleteClick() {
    this.props.actions.deleteCurrentDocument();
    $('#docsDisplayModal').modal('open');
  }

  render() {
    const { personalDocuments } = this.props;
    const count = personalDocuments.length;
    return (
      <div className="row">
        <div id="documentPage" className="col s12 z-depth-5 card-panel">
          <h4 className="center">MY DOCUMENTS</h4>
          <div id="addBtnDiv"
            className="fixed-action-btn" onClick={this.deleteClick}>
            <a
              className="btn-floating btn-large waves-effect waves-light darkblue tooltipped"
              data-position="left" data-delay="50"
              data-tooltip="create a new document">
              <i className="material-icons">create</i>
            </a>
          </div>
          <div className="row">
            <div className="col s12">
              <div className="row">
                <div className="col s5">
                  <div id="card-alert" className="card indigo lighten-5">
                    <div className="card-content black-text" id="documentCount">
                      <p>INFO : You have {count} Documents</p>
                    </div>
                  </div>
                </div>
                <div className="col s7">
                  <DocumentList personalDocuments={personalDocuments} />
                </div>
              </div>
            </div>

          </div>
          <CommonModal />
        </div>
      </div>
    );
  }
}

DocumentPage.propTypes = {
  personalDocuments: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

/**
 * @param {any} state
 * @returns {any}
 */
function mapStateToProps(state) {
  const currentState = state.handleDocuments;
  let personalDocuments = [];
  if (state.auth.isAuthenticated) {
    personalDocuments = currentState.documents.filter(
      doc => doc.ownerId === state.auth.user.userId);
  }

  const publicDocuments = currentState.documents.filter(
    doc => doc.access === 'public');

  return {
    personalDocuments,
    publicDocuments,
    currentDocument: currentState.chosenDocument
  };
}

/**
 * @param {any} dispatch
 * @returns {any}
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(documentActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPage);

