import { PropTypes } from 'prop-types';

function WizardPage({ title, children }) {
    return (<div className="my-4">
        <div>
            <h5>{title}</h5>
        </div>
        <div>
            {children}
        </div>
    </div>);
}

WizardPage.propTypes = {
    title: PropTypes.string.isRequired
}

export default WizardPage;