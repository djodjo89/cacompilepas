import React, {ReactNode} from "react";
import '../../css/CourseSheet.css';
import exampleImage from "../../img/example.png";
import minusIcon from "../../img/minus-icon-red-t.png";

interface CourseSheetProps {
    id: string,
    title: string,
    publication_date: string,
    link: string,
    description: string,
    activeRemoveButton: boolean,
    delete: ((event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void) | undefined,
}

class CourseSheet extends React.Component<CourseSheetProps, {}> {
    public constructor(props: CourseSheetProps) {
        super(props);
    }

    public render(): ReactNode {
        return (
            <div id={'coursesheet-' + this.props.id} className="course-sheet-card row mt-5 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div
                    className="col-lg-2 col-md-2 col-sm-2 col-xs-2 mt-lg-4 mt-md-4 mt-sm-4 mt-xs-4 pl-lg-0 pl-md-0 pl-sm-0 pl-xs-0 pr-lg-0 pr-md-0 pr-sm-0 pr-xs-0">
                    <img className="course-sheet-image rounded" src={exampleImage} alt="Course sheet"/>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                    <div className={'container-fluid row pl-0'}>
                        <h3 className='col-11 text-left mt-lg-0 mt-md-0 mt-sm-0 mt-xs-0'>{this.props.title}</h3>
                        {this.props.activeRemoveButton ?
                            <div className={'col-1 col-1 pr-0 mt-2'}>
                                <img
                                     id={'coursesheet-remove-' + this.props.id}
                                     src={minusIcon}
                                     alt={'Minus Icon'}
                                     className={'remove-button plus-icon ml-5 mr-0'}
                                     onClick={this.props.delete}
                            />
                            </div> :
                            <div></div>}
                    </div>
                    <div className='course-sheet-presentation ml-lg-1 ml-md-1 ml-sm-1 ml-xs-1'>
                        <p className='course-sheet-description'>{this.props.description}</p>
                        <footer className='pl-lg-0'>
                            <a href={this.props.link}
                               className="course-sheet-link col-lg-6 col-md-6 col-sm-6 col-xs-6 text-lg-left text-md-left text-sm-left text-xs-left pl-lg-0 pl-md-0 pl-sm-0 pl-xs-0 d-block mt-lg-2 mt-md-2 mt-sm-2 mt-xs-2">Lien
                                vers la fiche</a>
                            <h4 className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-lg-right text-md-right text-sm-right text-xs-right">Mathys</h4>
                        </footer>
                    </div>
                </div>
            </div>
        )
    }
}

export default CourseSheet;
