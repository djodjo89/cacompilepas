import React, {ReactNode} from "react";
import '../../css/CourseSheet.css';
import exampleImage from "../../img/example.png";

interface CourseSheetProps {
    title: string,
    publication_date: string,
    link: string,
    description: string,
}

class CourseSheet extends React.Component<CourseSheetProps, {}> {
    public render(): ReactNode {
        return (
            <div className="course-sheet-card row mt-5">
                <div className="col-lg-2 mt-lg-4 pl-lg-0 pr-lg-0">
                    <img className="course-sheet-image rounded" src={exampleImage} alt="Course sheet"/>
                </div>
                <div className="col-lg-10">
                    <h3 className="text-left mt-lg-0">{this.props.title}</h3>
                    <div className="course-sheet-presentation ml-lg-1">
                        <p className="course-sheet-description">{this.props.description}</p>
                        <footer className="pl-lg-0">
                            <a href={this.props.link} className="col-lg-6 text-lg-left pl-lg-0 d-block mt-lg-2">Lien vers la fiche</a>
                            <h4 className="col-lg-6 text-lg-right">Mathys</h4>
                        </footer>
                    </div>
                </div>
            </div>
        )
    }
}

export default CourseSheet;
